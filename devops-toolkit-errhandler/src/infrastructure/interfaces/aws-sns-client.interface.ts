import {
  PublishCommandInput,
  PublishCommandOutput
} from '@aws-sdk/client-sns';

export interface IAwsSNSClient {
  publish(params: PublishCommandInput): Promise<PublishCommandOutput>;
}
