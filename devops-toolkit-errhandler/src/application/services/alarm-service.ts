import {inject, injectable} from "inversify";
import TYPES from "../../infrastructure/types";
import {IAlarmService} from "./alarm-service.interface";
import {ICloudwatchAlarm} from "../../domain/models/cloudwatch-alarm.interface";
import { IAwsDynamoDBClient } from '../../infrastructure/interfaces/aws-dynamodb-client.interface';
import { GetCommandInput, PutCommandInput, ScanCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { IAwsSNSClient } from '../../infrastructure/interfaces/aws-sns-client.interface';

@injectable()
export class AlarmService implements IAlarmService {

  private alarmPriorityThreshold = 4;

  constructor(@inject(TYPES.IAwsDynamoDBClient) private ddbClient: IAwsDynamoDBClient,
              @inject(TYPES.AlarmTableName) private alarmTableName: string,
              // @inject(TYPES.ApplicationErrorConfigTableName) private appErrorConfigTableName: string,
              @inject(TYPES.IAwsSNSClient) private snsClient: IAwsSNSClient,
              @inject(TYPES.EnrichedErrorSNSTopicArn) private enrichedErrorSNSTopicArn: string,
              @inject(TYPES.AlarmPriorityThreshold) alarmPriorityThreshold: string) {
    this.alarmPriorityThreshold = Number(alarmPriorityThreshold);
  }

  /**
   * Update from toolkit
   * @param alarm
   */
  async updateAlarm(a: any, userId: string) {
    console.info('payload: ', a);

    const params: UpdateCommandInput = {
      TableName: this.alarmTableName,
      Key: { alarmName: a.alarmName },
      UpdateExpression: "set alarmDescription = :alarmDescription, priority = :priority, remediation = :remediation, lastUpdatedAt = :lastUpdatedAt, lastUpdatedBy = :lastUpdatedBy" ,
      ExpressionAttributeValues: {
        ":alarmDescription": a.alarmDescription,
        ":priority": a.priority,
        ":remediation": a.remediation,
        ":lastUpdatedAt": new Date().toISOString(),
        ":lastUpdatedBy": userId
      },
      ReturnValues: 'ALL_NEW',
    };

    const res = await this.ddbClient.update(params);
    console.debug('Updated alarm details in ddb', res)
  }

  async persistAlarm(a: ICloudwatchAlarm) {

    // Does alarm already exist? If so, then enrich content and send, else add.

    const getParams: GetCommandInput = {
      TableName: this.alarmTableName,
      Key: {
        alarmName: a.AlarmName
      },
    }

    const getRes = await this.ddbClient.get(getParams);
    console.log('getRes:', getRes);
    const existingAlarm = getRes.Item;
    console.log('existingAlarm:', existingAlarm);
    if(existingAlarm) {
      console.info('Enriching alarm...')
      a.AlarmDescription = existingAlarm.alarmDescription;
      a.Priority = existingAlarm.priority;
      a.Remediation = existingAlarm.remediation;
    }
    else {
      const tokens = a.AlarmName.split('-');
      const applicationName = tokens.slice(0, -3).join('-');

      const arnTokens = a.AlarmArn.split(':');
      const region = arnTokens[3];
      const currentTime = new Date().toISOString();

      const dto = {
        alarmName: a.AlarmName,
        alarmArn: a.AlarmArn,
        awsAccountId: a.AWSAccountId,
        region: region,
        application: applicationName,
        alarmDescription: a.AlarmDescription,
        priority: 0,
        remediation: '',
        trigger:
            {
              metricName: a.Trigger.MetricName,
              namespace: a.Trigger.Namespace,
              statistic: a.Trigger.Statistic,
              comparisonOperator: a.Trigger.ComparisonOperator,
              threshold: a.Trigger.Threshold,
              dimensions: a.Trigger.Dimensions
            },
        createdAt: currentTime,
        createdBy: 'receiveAlarm',
        lastUpdatedAt: currentTime,
        lastUpdatedBy: 'receiveAlarm'
      };

      console.info('payload', dto);

      const params: PutCommandInput = {
        TableName: this.alarmTableName,
        Item: dto,
        ReturnValues: 'ALL_OLD',
      };

      const res = await this.ddbClient.put(params);
      console.debug('Added alarm details in ddb', res)

      // TODO - application config table needs to be available. Move to here?
      //Also define applicationErrorConfig record for toolkit
      // const appConfig: IApplicationErrorConfig = {
      //   ApplicationId: applicationName,
      //   Region: process.env.AWS_REGION || '',
      //   Description: "TBD"
      // }
      //
      // const appParams: PutCommandInput = {
      //   TableName: this.appErrorConfigTableName,
      //   Item: appConfig,
      //   ConditionExpression: "attribute_not_exists(ApplicationId)",
      //   ReturnValues: 'ALL_OLD',
      // };
      //
      // const appRes = await this.ddbClient.put(appParams);
      // console.debug('Added app details in ddb', appRes)

    }

    // Now publish if priority >= threshold
    if(a.Priority || 5 >= this.alarmPriorityThreshold) {
      console.info('Publishing alarm...', a);
      const snsParams = {
        TopicArn: this.enrichedErrorSNSTopicArn,
        Message: JSON.stringify(a)
      }
      const publishRes = await this.snsClient.publish(snsParams);
      console.debug(publishRes);
    }
  };

  async getAlarms(): Promise<any> {

    console.info('Getting all alarms');

    const params: ScanCommandInput = {
      TableName: this.alarmTableName
    };

    const res = await this.ddbClient.scan(params);
    return res;

  };
}
