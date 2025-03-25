import 'reflect-metadata';
import {SNSMessage} from 'aws-lambda';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: SNSMessage) => {
  console.info('Reveived event...');
  console.info(JSON.parse(event.Message));
};
