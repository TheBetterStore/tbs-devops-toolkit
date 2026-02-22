import 'reflect-metadata';
import {APIGatewayEvent} from 'aws-lambda';
import {IDlqErrorService} from "../../services/dlqerror-service.interface";
import container from "./container";
import TYPES from "../../../infrastructure/types";
import {HttpUtils} from "../../../infrastructure/http-utils";
import {IClaims} from "../../../domain/models/claims.interface";
import {AuthUtils} from "../../../infrastructure/auth-utils";
import {InvalidDataError} from "../../../domain/models/invalid-data-error";

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  console.info('Entered handler', event);

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

  if (!event.queryStringParameters) {
    throw new InvalidDataError('Query parameters are not provided');
  }

  const params = event.queryStringParameters;
  if (!params.dlqName) {
    throw new InvalidDataError('DlqName parameter has not been provided');
  }

  const svc = container.get<IDlqErrorService>(TYPES.IDlqErrorService);

  const res = await svc.getErrors(params.dlqName);
  console.info('result', res);
  const response = HttpUtils.buildJsonResponse(200, res, event?.headers?.origin + '');
  console.info('Exiting handler');
  return response;
};