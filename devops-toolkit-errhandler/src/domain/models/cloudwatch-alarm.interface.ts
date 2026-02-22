export interface ICloudwatchAlarm {
  AlarmName: string;
  AlarmDescription: string;
  AWSAccountId: string;
  AlarmConfigurationUpdatedTimestamp: string;
  NewStateValue: string;
  NewStateReason: string;
  StateChangeTime: string;
  Region: string;
  AlarmArn: string;
  OldStateValue: string;
  ActionExecutedAfterMuteWindow: boolean;
  OKActions: string[];
  AlarmActions: string[];
  InsufficientDataActions: string[];
  Priority?: number;
  Remediation?: string;
  Trigger: {
    MetricName: string;
    Namespace: string;
    StatisticType: string;
    Statistic: string;
    Unit: null | string;
    Dimensions: Array<{
      value: string;
      name: string;
    }>;
    Period: number;
    EvaluationPeriods: number;
    ComparisonOperator: string;
    Threshold: number;
    TreatMissingData: string;
    EvaluateLowSampleCountPercentile: string;
  };

}
