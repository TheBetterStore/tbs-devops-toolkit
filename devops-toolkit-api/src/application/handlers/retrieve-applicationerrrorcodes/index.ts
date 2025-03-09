import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {IAppErrorService} from '../../services/app-error-service.interface';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  Logger.info('Entered retrieve-applicationerrorcodes handler', event);

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'}, event?.headers?.origin + '');
  }
  const userClaims: IClaims = event.requestContext.authorizer.claims;
  Logger.debug('Received userClaims:', userClaims);
  if (!AuthUtils.isViewer(userClaims)) {
    Logger.info('Not authorised');
    const response = HttpUtils.buildJsonResponse(401, {message: 'Not authorised'}, event?.headers?.origin + '');
    return response;
  }

  if (!event.queryStringParameters) {
    throw new InvalidDataError('Query parameters are not provided');
  }

  const params = event.queryStringParameters;
  if (!params.applicationId) {
    throw new InvalidDataError('ApplicationId parameter has not been provided');
  }
  const applicationId = params.applicationId;

  try {
    const svc = container.get<IAppErrorService>(TYPES.IAppErrorService);
    const errorCodes = await svc.retrieveApplicationErrorCodes(applicationId);

    Logger.debug('Error codes:', errorCodes);

    const response = HttpUtils.buildJsonResponse(200, errorCodes, event?.headers?.origin + '');
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
