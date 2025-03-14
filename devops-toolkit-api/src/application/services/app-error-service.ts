import {IAppErrorService} from './app-error-service.interface';
import {inject, injectable} from 'inversify';
import TYPES from '../../infrastructure/types';
import {IDynamoDBClient} from '../../infrastructure/interfaces/dynamodb-client.interface';
import {ISSMClient} from '../../infrastructure/interfaces/ssm-client.interface';
import {DocumentClient, PutItemOutput, QueryOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';
import {IApplicationErrorCode} from '../../domain/models/application-error-code.interface';
import {IApplicationErrorConfig} from '../../domain/models/application-error-config.interface';

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
    console.info(`Retrieving codes for ${applicationId}, against table ${this.appErrorCodeTableName}`);
    const params: DocumentClient.QueryInput = {
      TableName: this.appErrorCodeTableName,
      ExpressionAttributeValues: {':appId': applicationId},
      KeyConditionExpression: 'ApplicationId = :appId',
    };
    console.info(params);

    const res = await this.ddbClient.query(params);
    return res;
  }

  /**
   * saveApplicationErrorCode
   * @param {any} ec
   * @return {Promise<PutItemOutput>}
   */
  async saveApplicationErrorCode(ec: IApplicationErrorCode): Promise<PutItemOutput> {
    console.info(`Upserting code ${ec}, against table ${this.appErrorCodeTableName}`);
    const params: DocumentClient.PutItemInput = {
      TableName: this.appErrorCodeTableName,
      Item: ec,
    };
    console.info(params);

    const res = await this.ddbClient.put(params);
    return res;
  }

  /**
   * saveApplicationErrorCode
   * @param {any} ec
   * @return {Promise<PutItemOutput>}
   */
  async saveApplicationErrorConfig(ec: IApplicationErrorConfig): Promise<PutItemOutput> {
    console.info(`Upserting code ${ec}, against table ${this.appErrorCodeTableName}`);
    const params: DocumentClient.PutItemInput = {
      TableName: this.appErrorConfigTableName,
      Item: ec,
    };
    console.info(params);

    const res = await this.ddbClient.put(params);
    return res;
  }
}
