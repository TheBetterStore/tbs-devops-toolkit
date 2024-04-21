export interface IComplianceEvaluationResult {
  ComplianceType: string;
  ConfigRuleInvokedTime: string;
  ResultRecordedTime: string;
  EvaluationResultIdentifier: IEvaluationResultIdentifier;
}

export interface IEvaluationResultIdentifier {
  EvaluationResultQualifier: IEvaluationResultQualifier;
}

export interface IEvaluationResultQualifier {
  EvaluationMode: string;
  ResourceId: string;
  ResourceType: string;
}
