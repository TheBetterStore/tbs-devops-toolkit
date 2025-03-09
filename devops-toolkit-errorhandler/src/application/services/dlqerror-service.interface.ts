import {SQSRecord} from "aws-lambda";

export interface IDlqErrorService {
  persistError(error: SQSRecord): any;
}