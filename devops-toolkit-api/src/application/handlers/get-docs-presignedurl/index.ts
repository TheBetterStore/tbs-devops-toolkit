import 'reflect-metadata';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {Logger} from '../../../infrastructure/logger';
import {HttpUtils} from '../../../infrastructure/http-utils';
import {AuthUtils} from '../../../infrastructure/auth-utils';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client
} from '@aws-sdk/client-s3';
import {InvalidDataError} from '../../../domain/models/invalid-data-error';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent) => {
  console.info('Entered describe-compliancerules handler', event);

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
  if (!params.key) {
    throw new InvalidDataError('Key parameter has not been provided');
  }

  if (!params.type) {
    throw new InvalidDataError('Type parameter has not been provided');
  }
  if (params.type != 'GET' && params.type != 'PUT') {
    throw new InvalidDataError('Type parameter must be GET or PUT');
  }

  const type: 'GET' | 'PUT' = params.type;

  const s3Client = new S3Client();
  let url: string;
  switch (type) {
    case 'GET':
      const s3GetParams: GetObjectCommandInput = {
        Bucket: process.env.DOCS_BUCKET_NAME || '',
        Key: params.key,
      };
      const getCommand = new GetObjectCommand(s3GetParams);
      url = await getSignedUrl(s3Client, getCommand, {expiresIn: 300});
      break;
    case 'PUT':
      const s3PutParams: PutObjectCommandInput = {
        Bucket: process.env.DOCS_BUCKET_NAME || '',
        Key: params.key,
      };
      const putCommand = new PutObjectCommand(s3PutParams);
      url = await getSignedUrl(s3Client, putCommand, {expiresIn: 300});
      break;
  }

  const response = HttpUtils.buildJsonResponse(200, {s3PresignedUrl: url}, event?.headers?.origin + '');
  return response;
};
