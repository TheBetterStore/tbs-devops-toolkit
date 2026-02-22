import {IDlqErrorService} from "./dlqerror-service.interface";
import {SQSRecord} from "aws-lambda";
import {inject, injectable} from "inversify";
import TYPES from "../../infrastructure/types";
import {IAwsDynamoDBClient} from "../../infrastructure/interfaces/aws-dynamodb-client.interface";
import {PutCommandInput, ScanCommandInput, ScanCommandOutput, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";

@injectable()
export class DlqErrorService implements IDlqErrorService {

  private ddbClient: IAwsDynamoDBClient;
  private readonly dlqErrorTableName = process.env.DLQ_ERROR_TABLE_NAME || '';
  private readonly dlqErrorCountTableName = process.env.DLQ_ERROR_COUNT_TABLE_NAME || '';

  constructor(@inject(TYPES.IAwsDynamoDBClient) ddbClient: IAwsDynamoDBClient) {
    this.ddbClient = ddbClient;
  }

  async persistError(rec: SQSRecord) {
    const srcTokens = rec.eventSourceARN.split(':')
    const dlqName = srcTokens[5];

    const payload: any = JSON.parse(rec.body);
    console.debug(payload.detail);
    console.debug('MessageId', rec.messageId);
    console.debug('Source', rec.eventSourceARN);
    console.debug('DlqName', dlqName);
    console.debug('Attributes', JSON.stringify(rec.attributes));
    console.debug('MessageAttributes', JSON.stringify(rec.messageAttributes));

    const requestId = rec.messageAttributes.RequestID?.stringValue;
    const errorCode = rec.messageAttributes.ErrorCode?.stringValue;
    const errorMessage = rec.messageAttributes.ErrorMessage?.stringValue;

    console.info(`Message details - requestId: ${requestId}, errorCode: ${errorCode}, errorMessage: ${errorMessage}`);

    const dto = {
      messageId: rec.messageId,
      dlqName: dlqName,
      requestId: requestId,
      errorCode: errorCode,
      errorMessage: errorMessage,
      payload: payload.detail
    };

    console.info('payload', dto);
    console.log('Pending implementation');

    const params: PutCommandInput = {
      TableName: this.dlqErrorTableName,
      Item: dto,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    return res;

  };

  async persistErrorCounts(dlqCounts: any) {
    console.info('Entered persistErrorCounts');
    for(const k in dlqCounts) {
      const params: UpdateCommandInput = {
        TableName: this.dlqErrorCountTableName,
        Key: {dlqName: dlqCounts[k]},
        UpdateExpression: 'ADD itemCount :val',
        ExpressionAttributeValues: {val: dlqCounts[k].value},
        ReturnValues: 'UPDATED_NEW',
      };
      const res = await this.ddbClient.update(params);
      console.log(res);
    }
  }

  async getErrorCounts(): Promise<ScanCommandOutput> {
    console.info('Entered getErrorCounts');
    const params: ScanCommandInput = {
      TableName: this.dlqErrorCountTableName,
    };
    const res = await this.ddbClient.scan(params);
    console.log(res);
    return res;
  }

  async getErrors(dlqName: string): Promise<ScanCommandOutput> {
    console.info('Entered getErrorCounts');
    const params: ScanCommandInput = {
      TableName: this.dlqErrorTableName,
      FilterExpression: 'dlqName = :dlqName',
      ExpressionAttributeValues: {':dlqName': dlqName},
      Select: 'ALL_ATTRIBUTES'
    };
    const res = await this.ddbClient.scan(params);
    console.log(res);
    return res;
  }
}
