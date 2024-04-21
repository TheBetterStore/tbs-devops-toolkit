import {Logger} from "../../infrastructure/logger";

exports.handler = async (event) => {
  Logger.info('Received event:', event);

  // allowed domains
  const ald = (process.env.DOMAINALLOWLIST || '').split(',').map((d) => d.trim());

  const { email } = event.request.userAttributes;
  const domain = email.substring(email.indexOf('@') + 1);

  if (!ald.includes(domain)) {
    throw new Error(`Invalid email domain: ${domain}`);
  }

  return event;
};
