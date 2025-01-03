import {ComplianceByConfigRule} from '@aws-sdk/client-config-service';
import {ScanOutput} from 'aws-sdk/clients/dynamodb';

export interface IAppComplianceService {
  getPreviousNoncompliantRuleCounts(): Promise<ScanOutput>
  retrieveComplianceRules(region: string): Promise<ComplianceByConfigRule[]>;
  resetNoncomplianceCounts(region: string): Promise<any>
}
