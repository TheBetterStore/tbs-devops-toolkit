import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {DescribeParametersCommandInput, GetParameterCommandInput, ParameterStringFilter} from '@aws-sdk/client-ssm';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';

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

  let pageSize = 100;
  let filters: ParameterStringFilter[] = [];
  let nextToken = '';
  let region = '';

  try {
    if (!event.queryStringParameters) {
      throw new InvalidDataError('Query parameters are not provided');
    }

    const params = event.queryStringParameters;
    if (!params.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }

    filters = JSON.parse(event.queryStringParameters['filters'] + '');
    pageSize = Number(event.queryStringParameters['pageSize'] || 100);
    nextToken = event.queryStringParameters['nextToken'] + '';
    region = params.region + '';

    console.log('Using filters:', filters);

    const q: DescribeParametersCommandInput = {
      ParameterFilters: filters,
      MaxResults: pageSize,
    };

    if (nextToken) {
      q.NextToken = nextToken;
    }

    const client = container.get<ISSMClient>(TYPES.ISsmClient);
    const p = await client.describeParameters(region, q);

    const result: any[] = [];
    if (p.Parameters) {
      for (let i = 0; i < p.Parameters.length; i++) {
        const input: GetParameterCommandInput = {
          Name: p.Parameters[i].Name,
        };
        const p2 = await client.getParameter(region, input);
        result.push(p2.Parameter);
      }
    }

    p.Parameters = result;
    console.debug('Result:', p);

    const response = HttpUtils.buildJsonResponse(200, p, event?.headers?.origin + '');
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
