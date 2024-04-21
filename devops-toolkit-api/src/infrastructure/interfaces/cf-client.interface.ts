import {
  CreateChangeSetCommandInput,
  CreateChangeSetCommandOutput,
  DescribeChangeSetCommandInput,
  DescribeChangeSetCommandOutput, DescribeStackResourceDriftsInput, DescribeStackResourceDriftsOutput,
  DescribeStacksCommandInput,
  DescribeStacksCommandOutput, DetectStackDriftCommandInput,
  DetectStackDriftCommandOutput,
  ExecuteChangeSetCommandInput,
  ExecuteChangeSetCommandOutput,
} from '@aws-sdk/client-cloudformation';

export interface ICFClient {
  describeStacks(region: string, input: DescribeStacksCommandInput): Promise<DescribeStacksCommandOutput>;

  describeChangeset(region: string, input: DescribeChangeSetCommandInput): Promise<DescribeChangeSetCommandOutput>;

  createChangeSet(region: string, input: CreateChangeSetCommandInput): Promise<CreateChangeSetCommandOutput>;

  executeChangeSet(region: string, input: ExecuteChangeSetCommandInput): Promise<ExecuteChangeSetCommandOutput>;

  detectStackDrift(region: string, input: DetectStackDriftCommandInput): Promise<DetectStackDriftCommandOutput>;

  describeStackResourceDrifts(region: string,
                              input: DescribeStackResourceDriftsInput): Promise<DescribeStackResourceDriftsOutput>;
}
