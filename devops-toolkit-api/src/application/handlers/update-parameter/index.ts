import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {
  GetParameterCommandInput,
  GetParameterCommandOutput,
  PutParameterCommandInput, PutParameterCommandOutput,
} from '@aws-sdk/client-ssm';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';
import {AuditClient} from '../../../infrastructure/adapters/audit-client';

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

  const client = container.get<ISSMClient>(TYPES.ISsmClient);
  let region = '';

  try {
    if (!event.body) {
      throw new InvalidDataError('Message body is not provided');
    }

    const body: any = JSON.parse(event.body);
    Logger.debug('Body:', body);

    if (!body.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }
    region = body.region;

    // Executing...
    await AuditClient.writeAudit('ExecuteChangeset', event);
    const q: GetParameterCommandInput = {
      Name: body.name,
    };

    const p: GetParameterCommandOutput = await client.getParameter(region, q);

    if (p.Parameter) {
      const u: PutParameterCommandInput = {
        Name: p.Parameter.Name,
        Value: body.value,
        Overwrite: true,
      };
      const updateResult: PutParameterCommandOutput = await client.putParameter(region, u);
      Logger.debug('Result:', updateResult);
      const response = HttpUtils.buildJsonResponse(200, p, event?.headers?.origin + '');
      Logger.info('Exiting handler');
      return response;
    }
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
