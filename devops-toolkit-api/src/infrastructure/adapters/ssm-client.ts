import {ISSMClient} from '../interfaces/ssm-client.interface';
import {
  SSMClient,
  GetParametersCommand,
  GetParametersCommandInput,
  GetParametersByPathCommandInput,
  GetParametersByPathCommand,
  GetParameterCommandInput,
  GetParameterCommand,
  PutParameterCommandInput,
  PutParameterCommand,
  DescribeParametersCommandInput,
  DescribeParametersCommand,
  GetParameterCommandOutput, DescribeParametersCommandOutput,
} from '@aws-sdk/client-ssm';
import {injectable} from 'inversify';
import {Logger} from '../logger';

@injectable()
/**
 * SsmClient
 */
export class SsmClient implements ISSMClient {
  async getParameter(region: string, input: GetParameterCommandInput): Promise<GetParameterCommandOutput> {
    const client = new SSMClient({region: region});
    const command = new GetParameterCommand(input);
    const response = await client.send(command);
    return response;
  }

  async putParameter(region: string, input: PutParameterCommandInput): Promise<any> {
    const client = new SSMClient({region: region});
    const command = new PutParameterCommand(input);
    const response = await client.send(command);
    return response;
  }

  async getParameters(region: string, input: GetParametersCommandInput): Promise<any> {
    const client = new SSMClient({region: region});
    const command = new GetParametersCommand(input);
    const response = await client.send(command);
    return response;
  }

  async getParametersByPath(region: string, input: GetParametersByPathCommandInput): Promise<any> {
    const client = new SSMClient({region: region});
    const command = new GetParametersByPathCommand(input);
    const response = await client.send(command);
    return response;
  }
  async describeParameters(region: string, input: DescribeParametersCommandInput): Promise<DescribeParametersCommandOutput> {
    Logger.debug(`Querying params with region: ${region}`);
    const client = new SSMClient({region: region});
    const command = new DescribeParametersCommand(input);
    const response = await client.send(command);
    return response;
  }
}
