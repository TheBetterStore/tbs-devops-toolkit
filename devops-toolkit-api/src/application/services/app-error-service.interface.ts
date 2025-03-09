import {QueryOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';

export interface IAppErrorService {
  retrieveApplicationErrorConfigs(): Promise<ScanOutput>;
  retrieveApplicationErrorCodes(applicationId: string): Promise<QueryOutput>;
}
