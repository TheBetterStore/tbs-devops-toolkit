import 'reflect-metadata';
import {SNSMessage} from 'aws-lambda';
import {Logger} from '../../../infrastructure/logger';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: SNSMessage) => {
  Logger.info('Reveived event...');
  Logger.info(JSON.parse(event.Message));
};
