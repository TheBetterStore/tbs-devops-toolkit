import 'reflect-metadata';
import { SNSEvent } from 'aws-lambda';
import { ICloudwatchAlarm } from '../../../domain/models/cloudwatch-alarm.interface';
import container from "./container";
import TYPES from "../../../infrastructure/types";
import { IAlarmService } from '../../services/alarm-service.interface';

console.log('INFO - lambda is cold-starting.');
const svc = container.get<IAlarmService>(TYPES.IAlarmService);

exports.handler = async (event: SNSEvent) => {
  console.info('Entered receive-alarms handler', event);

  const recs = event.Records;
  for(let i = 0; i < recs.length; i++) {
    const sns = recs[i].Sns;
    console.info(sns.Message);
    const alarm: ICloudwatchAlarm = JSON.parse(sns.Message);
    await svc.persistAlarm(alarm);
  }

  console.info('Exiting handler');
};
