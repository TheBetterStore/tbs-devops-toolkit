import {
  PutCommandInput,
  PutCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  UpdateCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommandOutput
} from '@aws-sdk/lib-dynamodb';

export interface IAwsDynamoDBClient {
  put(params: PutCommandInput): Promise<PutCommandOutput>;
  update(params: UpdateCommandInput): Promise<UpdateCommandOutput>;
  scan(params: ScanCommandInput): Promise<ScanCommandOutput>;
  get(params: GetCommandInput): Promise<GetCommandOutput>;
  query(params: QueryCommandInput): Promise<QueryCommandOutput>
}
