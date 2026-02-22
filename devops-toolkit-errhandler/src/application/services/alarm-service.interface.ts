import {ICloudwatchAlarm } from '../../domain/models/cloudwatch-alarm.interface';

export interface IAlarmService {
  persistAlarm(alarm: ICloudwatchAlarm);
  updateAlarm(alarm: any, userId: string);
  getAlarms(): Promise<any>;
}
