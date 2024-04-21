import {
  DescribeComplianceByConfigRuleCommandInput,
  GetComplianceDetailsByConfigRuleCommandInput
} from '@aws-sdk/client-config-service';

export interface IConfigClient {
  describeComplianceByConfigRuleCommand(region: string,
                                                     input: DescribeComplianceByConfigRuleCommandInput): Promise<any>;

  getComplianceDetailsByConfigRuleCommand(region: string,
                                          input: GetComplianceDetailsByConfigRuleCommandInput): Promise<any>;
}
