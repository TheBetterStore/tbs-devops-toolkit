export interface IStack {
  StackId: string;
  StackName: string;

  Description: string;

  Parameters: any;

  DriftInformation: IStackDriftInformation;

  StackStatus: string;

  Tags: any;
  StackStatusReason: string;

  TimeoutInMinutes: number;

  CreationTime: any;
  LastUpdatedTime: any;
  DeletionTime: any;
}

export interface IStackDriftInformation {
  StackDriftStatus: "DRIFTED" | "NOT_CHECKED" | "IN_SYNC" | "UNKNOWN";
  LastCheckTimestamp?: any
}
