import {injectable} from 'inversify';
import {IAwsSNSClient} from "../../interfaces/aws-sns-client.interface";


import { SNSClient, PublishCommand, PublishCommandInput, PublishCommandOutput } from "@aws-sdk/client-sns";

const client = new SNSClient({});


// AWSXRay.captureAWSClient(client.service);

@injectable()
/**
 * AwsSNSClient
 */
export class AwsSNSClient implements IAwsSNSClient {
  /**
   * publish
   * @param {PublishCommandInput} params
   */
  async publish(params: PublishCommandInput): Promise<PublishCommandOutput> {
    console.debug(`Scanning items`);
    const command = new PublishCommand(params);
    return client.send(command);
  }
}
