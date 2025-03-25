export interface IStackParameter {
  ParameterKey: string;
  ParameterValue: string;
  ResolvedValue?: string;
  OriginalValue?: string;
  UsePreviousValue?: boolean;
}
