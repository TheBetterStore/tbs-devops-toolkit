import {IConfigClient} from '../interfaces/config-client.interface';
import {injectable} from 'inversify';
import {
  ConfigServiceClient,
  DescribeComplianceByConfigRuleCommand,
  DescribeComplianceByConfigRuleCommandInput,
  GetComplianceDetailsByConfigRuleCommand,
  GetComplianceDetailsByConfigRuleCommandInput,
} from '@aws-sdk/client-config-service';

@injectable()
/**
 * ConfigClient Provides AWS Config compliance functions
 */
export class ConfigClient implements IConfigClient {
  /**
   * Return config rules
   * @param {string} region
   * @param {DescribeComplianceByConfigRuleCommandInput} input
   */
  public async describeComplianceByConfigRuleCommand(region: string,
      input: DescribeComplianceByConfigRuleCommandInput): Promise<any> {
    let results: any = [];
    const client = new ConfigServiceClient({region: region});
    const command = new DescribeComplianceByConfigRuleCommand(input);
    let response = await client.send(command);

    results = results.concat(response.ComplianceByConfigRules);
    let nextToken = response.NextToken;

    while (nextToken) {
      input.NextToken = nextToken;
      response = await client.send(command);
      results = results.concat(response.ComplianceByConfigRules);
      nextToken = response.NextToken;
    }
    return results;
  }

  /**
   * GetComplianceDetailsByConfigRuleCommand
   * @param {string} region
   * @param {GetComplianceDetailsByConfigRuleCommandInput} input
   * @constructor
   */
  public async getComplianceDetailsByConfigRuleCommand(region: string,
      input: GetComplianceDetailsByConfigRuleCommandInput): Promise<any> {
    let results: any = [];
    const client = new ConfigServiceClient({region: region});
    const command = new GetComplianceDetailsByConfigRuleCommand(input);
    let response = await client.send(command);

    results = results.concat(response.EvaluationResults);
    let nextToken = response.NextToken;

    while (nextToken) {
      input.NextToken = nextToken;
      response = await client.send(command);
      results = results.concat(response.EvaluationResults);
      nextToken = response.NextToken;
    }
    return results;
  }
}
