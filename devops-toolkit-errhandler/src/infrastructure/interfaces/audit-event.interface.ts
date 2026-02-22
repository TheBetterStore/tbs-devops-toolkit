export interface IAuditEvent {
  requestId: string;
  traceId: string;
  serviceName: string;
  domainName: string,
  path: string;
  user: IUserIdentity;
  sourceIPAddress: string;
  userAgent: string;
  body: any;
}

export interface IUserIdentity {
  eventId: string;
  userName: string;
  sub: string;
  iss: string;
  authTime: string;
  exp: string;
}