import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {IAppErrorService} from '../../services/app-error-service.interface';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  console.info('Entered describe-compliancerules handler', event);

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'}, event?.headers?.origin + '');
  }
  const userClaims: IClaims = event.requestContext.authorizer.claims;
  console.debug('Received userClaims:', userClaims);
  if (!AuthUtils.isViewer(userClaims)) {
    console.info('Not authorised');
    const response = HttpUtils.buildJsonResponse(401, {message: 'Not authorised'}, event?.headers?.origin + '');
    return response;
  }

  try {
    const svc = container.get<IAppErrorService>(TYPES.IAppErrorService);
    const appConfigs = await svc.retrieveApplicationErrorConfigs();

    console.debug('Filtered rules:', appConfigs);

    const response = HttpUtils.buildJsonResponse(200, appConfigs, event?.headers?.origin + '');
    console.info('Exiting handler');
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
