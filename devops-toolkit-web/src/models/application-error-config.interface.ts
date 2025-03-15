export interface IApplicationErrorConfig {
  Id?: string;
  ApplicationId: string;
  Region: string;
  DlqName: string;
  Description: string;
  DlqErrorCount: number;
}
