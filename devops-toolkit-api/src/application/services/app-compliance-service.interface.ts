import {ComplianceByConfigRule} from '@aws-sdk/client-config-service';

export interface IAppComplianceService {
  retrieveComplianceRules(region: string): Promise<ComplianceByConfigRule[]>;
}
