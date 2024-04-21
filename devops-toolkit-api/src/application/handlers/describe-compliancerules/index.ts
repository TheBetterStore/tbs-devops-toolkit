import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {ComplianceByConfigRule, DescribeComplianceByConfigRuleCommandInput} from '@aws-sdk/client-config-service';
import {IConfigClient} from '../../../infrastructure/interfaces/config-client.interface';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {GetParameterCommandInput} from '@aws-sdk/client-ssm';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  Logger.info('Entered describe-compliancerules handler', event);

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'}, event?.headers?.origin + '');
  }
  const userClaims: IClaims = event.requestContext.authorizer.claims;
  Logger.debug('Received userClaims:', userClaims);
  if (!AuthUtils.isMaintainer(userClaims)) {
    Logger.info('Not authorised');
    const response = HttpUtils.buildJsonResponse(401, {message: 'Not authorised'}, event?.headers?.origin + '');
    return response;
  }

  let region = '';

  try {
    if (!event.queryStringParameters) {
      throw new InvalidDataError('Query parameters are not provided');
    }

    const queryParams = event.queryStringParameters;
    if (!queryParams.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }

    region = queryParams.region;

    const ssmClient = container.get<ISSMClient>(TYPES.ISsmClient);
    const param: GetParameterCommandInput = {
      Name: process.env.FILTERED_COMPLIANCE_RULES_PARAM || '',
    };
    const p = await ssmClient.getParameter(region, param);
    const rulesFilter: string[] = JSON.parse(p?.Parameter?.Value || '[]');

    Logger.debug('Using filters:', rulesFilter);


    const configClient = container.get<IConfigClient>(TYPES.IConfigClient);

    // First, get the current stack
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
    Logger.debug('Filtered rules:', filteredResults);

    const response = HttpUtils.buildJsonResponse(200, filteredResults, event?.headers?.origin + '');
    Logger.info('Exiting handler');
    return response;
  } catch (e: any) {
    if (e instanceof InvalidDataError) {
      const err = {message: e.message};
      const response = HttpUtils.buildJsonResponse(400, err, event?.headers?.origin + '');
      return response;
    } else {
      throw e;
    }
  }
};
