import {injectable} from 'inversify';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {IAwsDynamoDBClient} from "../../interfaces/aws-dynamodb-client.interface";
import {
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// AWSXRay.captureAWSClient(client.service);

@injectable()
/**
 * DynamoDBClient
 */
export class AwsDynamoDBClient implements IAwsDynamoDBClient {
  /**
   * scan
   * @param {QueryInput} params
   */
  async scan(params: ScanCommandInput): Promise<ScanCommandOutput> {
    console.debug(`Scanning items`);
    const command = new ScanCommand(params);
    return docClient.send(command);
  }

  /**
   * get
   * @param {GetItemInput} params
   */
  async get(params: GetCommandInput): Promise<GetCommandOutput> {
    console.debug('Getting from DynamoDB');
    const command = new GetCommand(params);
    return docClient.send(command);
  }

  /**
   * put
   * @param {PutItemInput} params
   */
  async put(params: PutCommandInput): Promise<PutCommandOutput> {
    console.debug('Putting object to DynamoDB', params);
    const command = new PutCommand(params);
    return docClient.send(command);
  }

  /**
   * update
   * @param {DocumentClient.UpdateItemInput} params
   * @returns {Promise<DocumentClient.UpdateItemOutput>}
   */
  async update(params: UpdateCommandInput): Promise<UpdateCommandOutput> {
    console.debug('Updating item in DynamoDB', params);
    const command = new UpdateCommand(params);
    return docClient.send(command);
  }

  /**
   * query
   * @param {QueryInput} params
   */
  async query(params: QueryCommandInput): Promise<QueryCommandOutput> {
    const command = new QueryCommand(params);
    return docClient.send(command);
  }
}
