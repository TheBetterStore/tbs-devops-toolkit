import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {ICFClient} from '../../../infrastructure/interfaces/cf-client.interface';
import {
  DescribeChangeSetCommandInput,
} from '@aws-sdk/client-cloudformation';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';

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

  let region = '';

  try {
    if (!event.queryStringParameters) {
      throw new InvalidDataError('Query parameters are not provided');
    }

    if (!event.pathParameters) {
      throw new InvalidDataError('Path parameters are not provided');
    }

    const queryParams = event.queryStringParameters;
    if (!queryParams.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }

    const pathParams = event.pathParameters;
    if (!pathParams['changeSetId']) {
      throw new InvalidDataError('Changesetid needs to be provided.');
    }

    region = queryParams.region;
    const decodedChangeSetId = decodeURIComponent(pathParams.changeSetId);

    const client = container.get<ICFClient>(TYPES.ICFClient);

    // First, get the current stack
    const q1: DescribeChangeSetCommandInput = {
      ChangeSetName: decodedChangeSetId,
    };
    const r = await client.describeChangeset(region, q1);

    console.debug('Result:', r);

    const response = HttpUtils.buildJsonResponse(200, r, event?.headers?.origin + '');
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
