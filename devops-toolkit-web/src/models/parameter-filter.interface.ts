export interface IParameterFilter {
  Key: string;
  Option: "Equals" | "BeginsWith" | "Contains";
  Values: string;
}
