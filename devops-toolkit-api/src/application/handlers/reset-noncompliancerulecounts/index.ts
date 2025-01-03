import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {IAppComplianceService} from '../../services/app-compliance-service.interface';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  Logger.info('Entered reset-noncompliancerulecounts handler', event);

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

    const svc = container.get<IAppComplianceService>(TYPES.IAppComplianceService);
    const result = await svc.resetNoncomplianceCounts(region);

    Logger.debug('Result:', result);

    const response = HttpUtils.buildJsonResponse(200, result, event?.headers?.origin + '');
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
