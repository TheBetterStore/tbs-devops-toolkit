import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {ICFClient} from '../../../infrastructure/interfaces/cf-client.interface';
import {CreateChangeSetCommandInput, DescribeStacksCommandInput} from '@aws-sdk/client-cloudformation';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  Logger.info('Entered handler', event);

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
    if (!event.body) {
      throw new InvalidDataError('Message body is not provided');
    }

    const body: any = JSON.parse(event.body);
    Logger.debug('Body:', body);

    if (!body.region) {
      throw new InvalidDataError('Region parameter has not been provided');
    }
    region = body.region;

    const client = container.get<ICFClient>(TYPES.ICFClient);

    // First, get the current stack
    const q1: DescribeStacksCommandInput = {
      StackName: body.stackName,
    };
    const r = await client.describeStacks(region, q1);
    if (!r.Stacks || r.Stacks.length != 1) {
      throw new InvalidDataError('Unable to retrieve details of existing stack to update');
    }
    const currentStack = r.Stacks[0];

    const currentTime = new Date();
    const q2: CreateChangeSetCommandInput = {
      // eslint-disable-next-line max-len
      ChangeSetName: `${userClaims.given_name}${userClaims.family_name}-${currentTime.getUTCFullYear()}${currentTime.getUTCMonth()}${currentTime.getUTCDate()}${currentTime.getUTCHours()}${currentTime.getUTCMinutes()}`,
      StackName: body.stackName,
      Parameters: currentStack.Parameters,
      ChangeSetType: 'UPDATE',
      Capabilities: currentStack.Capabilities,
      UsePreviousTemplate: true,
      Tags: currentStack.Tags,
    };

    const s = await client.createChangeSet(region, q2);

    Logger.debug('Result:', s);

    const response = HttpUtils.buildJsonResponse(200, s, event?.headers?.origin + '');
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
