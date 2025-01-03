/**
 * HttpUtils; provides helper functions for building http responses
 */
export class HttpUtils {
  static ALLOWED_CORS_DOMAINS = (process.env.ALLOWED_CORS_DOMAINS + '').split(',');
  /**
   * getSecurityHeaders
   * @description Set Content Security Policy and CORS headers in HTTP response
   * @param {string} originHeader
   * @return {any}
   */
  static getSecurityHeaders(originHeader: string): any {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Max-Age': 86400,
      'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
    };
    console.log('originHeader', originHeader);
    console.log('HttpUtils.ALLOWED_CORS_DOMAINS', HttpUtils.ALLOWED_CORS_DOMAINS);

    if (HttpUtils.ALLOWED_CORS_DOMAINS.includes(originHeader)) {
      headers['Access-Control-Allow-Origin'] = originHeader;
    }
    return headers;
  }

  /**
   * Build and return a JSON response with CSP and CORS headers
   * @param {number} statusCode statusCode
   * @param {object} body as JSON object
   * @param {string} requestOrigin request header for CORS
   * @param {any} headers
   * @return {object}
   */
  static buildJsonResponse(statusCode: number, body: object, requestOrigin: string, headers?: any): object {
    if (!headers) {
      headers = {};
    }
    const secHeaders = HttpUtils.getSecurityHeaders(requestOrigin);
    const combinedHeaders = {
      ...headers,
      ...secHeaders,
    };

    const response = {
      'statusCode': statusCode,
      'body': JSON.stringify(body),
      'headers': combinedHeaders,
      'isBase64Encoded': false,
    };
    return response;
  }
}
