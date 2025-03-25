import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {ICFClient} from '../../../infrastructure/interfaces/cf-client.interface';
import {DescribeStacksCommandInput, DescribeStacksCommandOutput} from '@aws-sdk/client-cloudformation';
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

  let region = '';
  const q: DescribeStacksCommandInput = {
  };

  try {
    if (!event.queryStringParameters) {
      throw new InvalidDataError('Query parameters are not provided');
    }
    const params = event.queryStringParameters;
    if (!params.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }

    if (params['stackName']) {
      q.StackName = params['stackName'];
    }

    region = params.region + '';
    console.log('Using params:', q);

    const client = container.get<ICFClient>(TYPES.ICFClient);

    let stacks: any[] = [];
    let nextToken: string | null | undefined = null;
    do {
      const s: DescribeStacksCommandOutput = await client.describeStacks(region, q);
      stacks = stacks.concat(s.Stacks);
      nextToken = s.NextToken;
      q.NextToken = nextToken;
      console.log('Using added stacks:', s.Stacks?.length);
      console.log(nextToken);
    } while (nextToken);

    console.debug('Result:', JSON.stringify(stacks));

    const response = HttpUtils.buildJsonResponse(200, stacks, event?.headers?.origin + '');
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
