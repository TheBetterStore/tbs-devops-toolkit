export interface IComplianceByConfigRule {
  ConfigRuleName: string;
  Compliance: ICompliance
}

export interface ICompliance {
  ComplianceContributorCount: IComplianceContributorCount,
  ComplianceType: IComplianceType
}

export interface IComplianceContributorCount {
  CapExceeded: boolean,
  ComplianceContributorCount: number
}

export interface IComplianceType {
  readonly Compliant: "COMPLIANT"
  readonly Insufficient_Data: "INSUFFICIENT_DATA";
  readonly Non_Compliant: "NON_COMPLIANT";
  readonly Not_Applicable: "NOT_APPLICABLE";
}
