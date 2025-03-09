import {IDlqErrorService} from "./dlqerror-service.interface";
import {SQSRecord} from "aws-lambda";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {inject, injectable} from "inversify";
import {IDynamoDBClient} from "../../infrastructure/interfaces/dynamodb-client.interface";
import TYPES from "../../infrastructure/types";

@injectable()
export class DlqErrorService implements IDlqErrorService {

  private ddbClient: IDynamoDBClient;
  private readonly dlqErrorTableName = process.env.DLQ_ERROR_TABLE_NAME || '';

  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient) {
    this.ddbClient = ddbClient;
  }

  async persistError(rec: SQSRecord) {
    const srcTokens = rec.eventSourceARN.split(':')
    const dlqName = srcTokens[5];

    const payload: any = JSON.parse(rec.body);
    console.debug(payload.detail);
    console.debug('MessageId', rec.messageId);
    console.debug('Source', rec.eventSourceARN);
    console.debug('DlqNAme', dlqName);
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

    const params: DocumentClient.PutItemInput = {
      TableName: this.dlqErrorTableName,
      Item: dto,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    return res;

  };
}