export interface IApplicationErrorConfig {
  ApplicationId: string;
  Region: string;
  DlqName: string;
  Description: string;
  CurrentCount: number;
}
