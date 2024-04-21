import {APIGatewayEvent} from 'aws-lambda';
import {PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient} from '@aws-sdk/client-sns';
import {IAuditEvent} from '../interfaces/audit-event.interface';
import {injectable} from 'inversify';

@injectable()
/**
 * AuditClient
 * Writes update events to SNS + logs
 */
export class AuditClient {
  private static snsClient = new SNSClient({region: 'ap-southeast-2'});
  private static auditTopicArn = process.env.AUDIT_TOPIC_ARN;

  /**
   * writeAudit
   * @param {string} serviceName
   * @param {APIGatewayEvent} event
   */
  public static async writeAudit(serviceName: string, event: APIGatewayEvent): Promise<PublishCommandOutput> {
    const msg: IAuditEvent = AuditClient.mapEvent(serviceName, event);

    const input: PublishCommandInput = {
      Message: JSON.stringify(msg),
      TopicArn: AuditClient.auditTopicArn,
    };
    const command = new PublishCommand(input);
    const response = await AuditClient.snsClient.send(command);
    return response;
  }

  /**
   * Create IAuditEvent payload to log
   * @param {string} serviceName
   * @param {APIGatewayEvent} event
   * @return {IAuditEvent}
   */
  static mapEvent(serviceName: string, event: APIGatewayEvent): IAuditEvent {
    const claims: any = event.requestContext.authorizer?.claims;

    const audit: IAuditEvent = {
      requestId: event.requestContext.requestId,
      traceId: event.headers['X-Amzn-Trace-Id'] + '',
      serviceName: serviceName,
      domainName: event.requestContext.domainName + '',
      path: event.requestContext.path,
      user: {
        eventId: claims?.event_id,
        userName: claims?.email,
        sub: claims?.sub,
        iss: claims?.iss,
        authTime: claims?.authTime,
        exp: claims?.exp,
      },
      sourceIPAddress: event.headers['X-Forwarded-For'] + '',
      userAgent: event.headers['User-Agen'] + '',
      body: event.body,
    };
    return audit;
  }
}
