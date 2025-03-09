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
import {DocumentClient, ScanOutput} from 'aws-sdk/clients/dynamodb';

@injectable()
/**
 * AppComplianceService
 */
export class AppComplianceService implements IAppComplianceService {
  private ddbClient: IDynamoDBClient;
  private ssmClient: ISSMClient;
  // private readonly configNonComplianceTableName: string;
  private readonly configNonComplianceCountsTableName: string;

  /**
   * constructor
   * @param {IDynamoDBClient} ddbClient
   * @param {ISSMClient} ssmClient
   */
  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient,
      @inject(TYPES.ISsmClient) ssmClient: ISSMClient) {
    this.ddbClient = ddbClient;
    this.ssmClient = ssmClient;
    // this.configNonComplianceTableName = process.env.NONCOMPLIANCE_TABLE_NAME || '';
    this.configNonComplianceCountsTableName = process.env.NONCOMPLIANCE_COUNTS_TABLE_NAME || '';
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

    // Now get prev
    const previousNoncompliantRuleCounts = await this.getPreviousNoncompliantRuleCounts();
    Logger.debug('previousNoncompliantRuleCounts: ', JSON.stringify(previousNoncompliantRuleCounts, null, 2));
    for (let i = 0; i < filteredResults.length; i++) {
      const filteredResult: any = filteredResults[i];
      const ruleName =filteredResult.ConfigRuleName;
      const previousCountItems = previousNoncompliantRuleCounts.Items?.filter((x)=> x.Rule == ruleName);
      Logger.debug('previousCountItems: ', JSON.stringify(previousCountItems, null, 2));
      let previousCount = 0;
      let previousUpdatedTime = '';
      if (previousCountItems && previousCountItems.length == 1) {
        previousCount = Number(previousCountItems[0]?.Count || '0' );
        previousUpdatedTime = (previousCountItems[0]?.LastUpdated || '') as string;
      }
      Logger.debug('previousCount: ', previousCount);
      filteredResult['PreviousNoncomplianceCount'] = previousCount;
      filteredResult['PreviousUpdatedTime'] = previousUpdatedTime;
    }
    return filteredResults;
  }

  /**
   *
   * @private
   */
  async getPreviousNoncompliantRuleCounts(): Promise<ScanOutput> {
    const params: DocumentClient.ScanInput = {
      TableName: this.configNonComplianceCountsTableName,
    };

    const res = await this.ddbClient.scan(params);
    return res;
  }

  /**
   * resetNoncomplianceCounts
   * @param {string} region
   */
  async resetNoncomplianceCounts(region: string): Promise<any> {
    const configClient = container.get<IConfigClient>(TYPES.IConfigClient);

    const q1: DescribeComplianceByConfigRuleCommandInput = {
      ComplianceTypes: ['NON_COMPLIANT'],
    };

    const r: ComplianceByConfigRule[] = await configClient.describeComplianceByConfigRuleCommand(region, q1);
    Logger.debug('Unfiltered rules:', r);

    const currentTime = new Date();
    for (let i = 0; i < r.length; i++) {
      const nonComplianceRec = r[i];
      console.log(nonComplianceRec);
      await this.updateNonComplianceRuleCount(nonComplianceRec.ConfigRuleName || '',
          Number(nonComplianceRec?.Compliance?.ComplianceContributorCount?.CappedCount || '0'),
          nonComplianceRec?.Compliance?.ComplianceContributorCount?.CapExceeded || false,
          currentTime.toISOString());
    }
  }

  /**
   * updateNonComplianceRuleCount
   * @param {string} ruleName
   * @param {number} count
   * @param {boolean} isCapExceeded
   * @param {string} updateTimeISO
   */
  async updateNonComplianceRuleCount(ruleName: string, count: number, isCapExceeded: boolean, updateTimeISO: string) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.configNonComplianceCountsTableName,
      Item: {
        Rule: ruleName,
        Count: count,
        CapExceeded: isCapExceeded,
        LastUpdated: updateTimeISO,
      },
    };
    const res = await this.ddbClient.put(params);
    return res;
  }
}
