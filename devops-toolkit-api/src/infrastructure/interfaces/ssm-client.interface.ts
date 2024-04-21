import {
  DescribeParametersCommandInput, DescribeParametersCommandOutput,
  GetParameterCommandInput, GetParameterCommandOutput,
  GetParametersByPathCommandInput,
  GetParametersCommandInput, PutParameterCommandInput,
} from '@aws-sdk/client-ssm';

export interface ISSMClient {
  getParameter(region: string, input: GetParameterCommandInput): Promise<GetParameterCommandOutput>;
  putParameter(region: string, input: PutParameterCommandInput): Promise<any>;
  getParameters(region: string, input: GetParametersCommandInput): Promise<any>;
  getParametersByPath(region: string, input: GetParametersByPathCommandInput): Promise<any>;
  describeParameters(region: string, input: DescribeParametersCommandInput): Promise<DescribeParametersCommandOutput>;
}
