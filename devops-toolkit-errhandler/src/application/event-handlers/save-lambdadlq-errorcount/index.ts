import 'reflect-metadata';
import {DynamoDBStreamEvent} from 'aws-lambda';
import {IDlqErrorService} from "../../services/dlqerror-service.interface";
import container from "./container";
import TYPES from "../../../infrastructure/types";

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: DynamoDBStreamEvent) => {
  console.info('Entered receive-lambdadlq-errors handler', event);

  const svc = container.get<IDlqErrorService>(TYPES.IDlqErrorService);

  const dlqCounts = {};
  let partitionKey = '';

  const recs = event.Records;
  for(let i = 0; i < recs.length; i++) {
    const rec = recs[i];
    if(rec.eventName == 'INSERT') {
      console.log(rec);
      partitionKey = rec.dynamodb?.Keys?.dlqName.S || '';
      if (!dlqCounts[partitionKey]) {
        dlqCounts[partitionKey].value = 0;
      }
      dlqCounts[partitionKey].value += 1;
    }
    else if (rec.eventName == 'REMOVE') {
      console.log(rec);
      partitionKey = rec.dynamodb?.Keys?.dlqName.S || '';
      if (!dlqCounts[partitionKey]) {
        dlqCounts[partitionKey].value = 0;
      }
      dlqCounts[partitionKey].value -= 1;
    }
  }
  await svc.persistErrorCounts(dlqCounts);
  console.info('Exiting handler');
};