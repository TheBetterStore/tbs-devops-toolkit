import {
  CloudFormationClient,
  CreateChangeSetCommand,
  CreateChangeSetCommandInput,
  CreateChangeSetCommandOutput,
  DescribeChangeSetCommand,
  DescribeChangeSetCommandInput,
  DescribeChangeSetCommandOutput,
  DescribeStackResourceDriftsCommand,
  DescribeStackResourceDriftsInput,
  DescribeStackResourceDriftsOutput,
  DescribeStacksCommand,
  DescribeStacksCommandInput,
  DescribeStacksCommandOutput,
  DetectStackDriftCommand,
  DetectStackDriftCommandInput,
  DetectStackDriftCommandOutput,
  ExecuteChangeSetCommand,
  ExecuteChangeSetCommandInput,
  ExecuteChangeSetCommandOutput,
} from '@aws-sdk/client-cloudformation';
import {injectable} from 'inversify';
import {ICFClient} from '../interfaces/cf-client.interface';

@injectable()
/**
 * CFClient
 */
export class CFClient implements ICFClient {
  /**
   * describeStacks
   * @param {string}  region
   * @param {DescribeStacksCommandInput} input
   */
  async describeStacks(region: string, input: DescribeStacksCommandInput): Promise<DescribeStacksCommandOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new DescribeStacksCommand(input);
    const response = await cfClient.send(command);
    return response;
  }

  /**
   * describeChangeset
   * @param {string} region
   * @param {DescribeChangeSetCommandInput} input
   */
  async describeChangeset(region: string,
      input: DescribeChangeSetCommandInput): Promise<DescribeChangeSetCommandOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new DescribeChangeSetCommand(input);
    const response = await cfClient.send(command);
    return response;
  }

  /**
   * createChangeSet
   * @param {string} region
   * @param {CreateChangeSetCommandInput} input
   */
  async createChangeSet(region: string, input: CreateChangeSetCommandInput): Promise<CreateChangeSetCommandOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new CreateChangeSetCommand(input);
    const response = await cfClient.send(command);
    return response;
  }

  /**
   * executeChangeSet
   * @param {string} region
   * @param {ExecuteChangeSetCommandInput} input
   */
  async executeChangeSet(region: string, input: ExecuteChangeSetCommandInput): Promise<ExecuteChangeSetCommandOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new ExecuteChangeSetCommand(input);
    const response = await cfClient.send(command);
    return response;
  }

  /**
   * detectStackDrift
   * @param {string} region
   * @param {DetectStackDriftCommandInput} input
   */
  async detectStackDrift(region: string, input: DetectStackDriftCommandInput): Promise<DetectStackDriftCommandOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new DetectStackDriftCommand(input);
    const response = await cfClient.send(command);
    return response;
  }

  /**
   * describeStackResourcesDrift
   * @param {string} region
   * @param {DescribeStackResourceDriftsInput} input
   */
  async describeStackResourceDrifts(region: string,
      input: DescribeStackResourceDriftsInput): Promise<DescribeStackResourceDriftsOutput> {
    const cfClient = new CloudFormationClient({region: region});
    const command = new DescribeStackResourceDriftsCommand(input);
    const response = await cfClient.send(command);
    return response;
  }
}
