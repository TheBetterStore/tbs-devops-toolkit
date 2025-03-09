import {IAppErrorService} from './app-error-service.interface';
import {inject, injectable} from 'inversify';
import TYPES from '../../infrastructure/types';
import {IDynamoDBClient} from '../../infrastructure/interfaces/dynamodb-client.interface';
import {ISSMClient} from '../../infrastructure/interfaces/ssm-client.interface';
import {DocumentClient, QueryOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';

@injectable()
/**
 * AppErrorService
 */
export class AppErrorService implements IAppErrorService {
  private appErrorConfigTableName: string;
  private appErrorCodeTableName: string;
  private ddbClient: IDynamoDBClient;

  /**
   * constructor
   * @param {IDynamoDBClient} ddbClient
   * @param {ISSMClient} ssmClient
   */
  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient,
              @inject(TYPES.ISsmClient) ssmClient: ISSMClient) {
    this.ddbClient = ddbClient;
    this.appErrorConfigTableName = process.env.APPLICATION_ERROR_CONFIG_TABLE_NAME || '';
    this.appErrorCodeTableName = process.env.APPLICATION_ERROR_CODE_TABLE_NAME || '';
  }

  /**
   * retrieveApplicationErrorConfigs
   */
  async retrieveApplicationErrorConfigs(): Promise<ScanOutput> {
    const params: DocumentClient.ScanInput = {
      TableName: this.appErrorConfigTableName,
    };

    const res = await this.ddbClient.scan(params);
    return res;
  }

  /**
   * retrieveApplicationErrorCodes
   * @param {string} applicationId
   * @return {Promise<QueryOutput>}
   */
  async retrieveApplicationErrorCodes(applicationId: string): Promise<QueryOutput> {
    const params: DocumentClient.QueryInput = {
      TableName: this.appErrorCodeTableName,
      ExpressionAttributeValues: {':appId': applicationId},
      KeyConditionExpression: 'ApplicationId = :appId',
    };

    const res = await this.ddbClient.query(params);
    return res;
  }
}
