export interface ILambdaDlqError {
  messageId: string;
  dlqName: string;
  errorCode: string;
  errorMessage: string;
  payload: any;
  requestId: string;
}
