const TYPES = {
  IDlqErrorService: Symbol('IDlqErrorService'),
  IAlarmService: Symbol('IAlarmService'),
  IAwsDynamoDBClient: Symbol('IAwsDynamoDBClient'),
  IAwsSNSClient: Symbol('IAwsSNSClient'),
  ApplicationErrorConfigTableName: Symbol('ApplicationErrorConfigTableName'),
  AlarmTableName: Symbol('AlarmTableName'),
  AlarmPriorityThreshold: Symbol('AlarmPriorityThreshold'),
  EnrichedErrorSNSTopicArn: Symbol('EnrichedErrorSNSTopicArn'),
};

export default TYPES;
