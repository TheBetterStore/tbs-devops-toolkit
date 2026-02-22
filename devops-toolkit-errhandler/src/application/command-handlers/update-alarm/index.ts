import 'reflect-metadata';
import {APIGatewayEvent} from 'aws-lambda';
import container from "./container";
import TYPES from "../../../infrastructure/types";
import {HttpUtils} from "../../../infrastructure/http-utils";
import {IClaims} from "../../../domain/models/claims.interface";
import {AuthUtils} from "../../../infrastructure/auth-utils";
import { IAlarmService } from '../../services/alarm-service.interface';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  console.info('Entered handler', event);

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'}, event?.headers?.origin + '');
  }
  const userClaims: IClaims = event.requestContext.authorizer.claims;
  console.debug('Received userClaims:', userClaims);

  if (!AuthUtils.isMaintainer(userClaims)) {
    console.info('Not authorised');
    const response = HttpUtils.buildJsonResponse(401, {message: 'Not authorised'}, event?.headers?.origin + '');
    return response;
  }

  // Executing...
  await AuditClient.writeAudit('ExecuteChangeset', event);
  const q: GetParameterCommandInput = {
    Name: body.name,
  };

  const svc = container.get<IAlarmService>(TYPES.IAlarmService);

  const alarm = JSON.parse(event.body || '{}');
  console.debug('Updating alarm', alarm);
  const res = await svc.updateAlarm(alarm);
  console.info('result', res);
  const response = HttpUtils.buildJsonResponse(200, res, event?.headers?.origin + '');
  console.info('Exiting handler');
  return response;
};
