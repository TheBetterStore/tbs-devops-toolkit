import 'reflect-metadata';
import {SQSEvent} from 'aws-lambda';
import {IDlqErrorService} from "../../services/dlqerror-service.interface";
import container from "./container";
import TYPES from "../../../infrastructure/types";

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: SQSEvent) => {
  console.info('Entered receive-lambdadlq-errors handler', event);

  const svc = container.get<IDlqErrorService>(TYPES.IDlqErrorService);

  const recs = event.Records;
  for(let i = 0; i < recs.length; i++) {
    const rec = recs[i];
    await svc.persistError(rec);

  }
  console.info('Exiting handler');
};