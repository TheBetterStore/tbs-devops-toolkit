export interface IApplicationErrorConfig {
  Id?: string;
  ApplicationId: string;
  Region: string;
  DlqName: string;
  Description: string;
  DlqErrorCount?: number;
  ImageKey?: string;
  FileToUpload?: File;
  CreatedAt?: string;
  LastUpdatedAt?: string;
}
