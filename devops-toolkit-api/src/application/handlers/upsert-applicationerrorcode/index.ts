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
  Logger.info('Entered handler', event);
  Logger.debug(JSON.stringify(event));

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'}, event?.headers?.origin + '');
  }

  const userClaims: IClaims = event.requestContext.authorizer.claims;
  Logger.debug('Received userClaims:', userClaims);
  if (!AuthUtils.isMaintainer(userClaims)) {
    const response = HttpUtils.buildJsonResponse(401, {message: 'Not authorised'}, event?.headers?.origin + '');
    return response;
  }

  if (!event.body) {
    throw new InvalidDataError('Message body is not provided');
  }

  const body: any = JSON.parse(event.body);
  body.Id = undefined;
  Logger.debug('Body:', body);

  // Executing...
  // await AuditClient.writeAudit('UpsertApplicationErrorCode', event);

  const svc = container.get<IAppErrorService>(TYPES.IAppErrorService);
  const updateResult = await svc.saveApplicationErrorCode(body);

  Logger.debug('Result:', updateResult);
  const response = HttpUtils.buildJsonResponse(200, {'status': 'updated'}, event?.headers?.origin + '');
  Logger.info('Exiting handler');
  return response;
};
