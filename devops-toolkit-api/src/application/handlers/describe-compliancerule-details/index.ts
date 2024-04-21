import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {
  EvaluationResult,
  GetComplianceDetailsByConfigRuleCommandInput,
} from '@aws-sdk/client-config-service';
import {IConfigClient} from '../../../infrastructure/interfaces/config-client.interface';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  Logger.info('Entered handler', event);

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

  try {
    if (!event.queryStringParameters) {
      throw new InvalidDataError('Query parameters are not provided');
    }

    const queryParams = event.queryStringParameters;
    if (!queryParams.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }

    if (!event.pathParameters) {
      throw new InvalidDataError('Path parameters are not provided');
    }

    const pathParams = event.pathParameters;
    if (!pathParams.ruleName) {
      throw new InvalidDataError('RuleName parameter has not been provided');
    }

    const region = queryParams.region;
    const ruleName = pathParams.ruleName;

    const configClient = container.get<IConfigClient>(TYPES.IConfigClient);

    // First, get the current stack
    const q1: GetComplianceDetailsByConfigRuleCommandInput = {
      ConfigRuleName: ruleName,
      ComplianceTypes: ['NON_COMPLIANT'],
      Limit: 100,
    };

    const r: EvaluationResult[] = await configClient.getComplianceDetailsByConfigRuleCommand(region, q1);
    Logger.debug('Evaluation results:', r);

    const response = HttpUtils.buildJsonResponse(200, r, event?.headers?.origin + '');
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
