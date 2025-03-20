export interface IApplicationErrorConfig {
  ApplicationId: string;
  Region: string;
  Description: string;
  DlqName: string;
  DlqErrorCount?: number;
  ImageKey?: string;
}
