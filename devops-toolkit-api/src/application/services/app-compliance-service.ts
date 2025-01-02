import {IAppComplianceService} from './app-compliance-service.interface';
import {inject, injectable} from 'inversify';
import {IDynamoDBClient} from '../../infrastructure/interfaces/dynamodb-client.interface';
import TYPES from '../../infrastructure/types';
import {ISSMClient} from '../../infrastructure/interfaces/ssm-client.interface';
import {GetParameterCommandInput} from '@aws-sdk/client-ssm';
import {Logger} from '../../infrastructure/logger';
import container from '../handlers/describe-compliancerules/container';
import {IConfigClient} from '../../infrastructure/interfaces/config-client.interface';
import {ComplianceByConfigRule, DescribeComplianceByConfigRuleCommandInput} from '@aws-sdk/client-config-service';

@injectable()
/**
 * AppComplianceService
 */
export class AppComplianceService implements IAppComplianceService {
  private ddbClient: IDynamoDBClient;
  private ssmClient: ISSMClient;
  private readonly configNonComplianceTableName: string;

  /**
   * constructor
   * @param {IDynamoDBClient} ddbClient
   * @param {ISSMClient} ssmClient
   */
  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient,
      @inject(TYPES.ISsmClient) ssmClient: ISSMClient) {
    this.ddbClient = ddbClient;
    this.ssmClient = ssmClient;
    this.configNonComplianceTableName = process.env.NONCOMPLIANCE_TABLE_NAME || '';
  }

  /**
   * retrieveComplianceRules
   * @param {string} region
   */
  async retrieveComplianceRules(region: string): Promise<ComplianceByConfigRule[]> {
    const param: GetParameterCommandInput = {
      Name: process.env.FILTERED_COMPLIANCE_RULES_PARAM || '',
    };

    const p = await this.ssmClient.getParameter(region, param);
    const rulesFilter: string[] = JSON.parse(p?.Parameter?.Value || '[]');

    Logger.debug('Using filters:', rulesFilter);

    const configClient = container.get<IConfigClient>(TYPES.IConfigClient);

    const q1: DescribeComplianceByConfigRuleCommandInput = {
      ComplianceTypes: ['NON_COMPLIANT', 'COMPLIANT'],
    };

    const r: ComplianceByConfigRule[] = await configClient.describeComplianceByConfigRuleCommand(region, q1);
    Logger.debug('Unfiltered rules:', r);

    const filteredResults: ComplianceByConfigRule[] = [];

    for (let i = 0; i < r.length; i++) {
      const rule: string = r[i].ConfigRuleName + '';
      let isFiltered = false;
      let j = 0;
      while (j < rulesFilter.length && !isFiltered) {
        if (rule.startsWith(rulesFilter[j])) {
          isFiltered = true;
        }
        j++;
      }
      if (!isFiltered) {
        filteredResults.push(r[i]);
      }
    }
    return filteredResults;
  }
}
