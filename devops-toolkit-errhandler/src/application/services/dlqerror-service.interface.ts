import {SQSRecord} from "aws-lambda";
import {ScanOutput} from "aws-sdk/clients/dynamodb";

export interface IDlqErrorService {
  persistError(error: SQSRecord): any;
  persistErrorCounts(dlqCounts: any);
  getErrorCounts(): Promise<ScanOutput>;
  getErrors(dlqName: string): Promise<ScanOutput>
}