import {QueryOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';
import {IApplicationErrorCode} from '../../domain/models/application-error-code.interface';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import PutItemOutput = DocumentClient.PutItemOutput;
import {IApplicationErrorConfig} from '../../domain/models/application-error-config.interface';

export interface IAppErrorService {
  retrieveApplicationErrorConfigs(): Promise<ScanOutput>;
  saveApplicationErrorConfig(ec: IApplicationErrorConfig): Promise<PutItemOutput>
  retrieveApplicationErrorCodes(applicationId: string): Promise<QueryOutput>;
  saveApplicationErrorCode(ec: IApplicationErrorCode): Promise<PutItemOutput>
}
