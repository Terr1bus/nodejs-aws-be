import { APIGatewayProxyResult } from 'aws-lambda';

type Options = Omit<APIGatewayProxyResult, 'body'> & {
  body: Record<string, any>;
};

export class ApiGatewayResult implements APIGatewayProxyResult {
  statusCode: number;
  headers?: { [header: string]: string | number | boolean };
  multiValueHeaders?: { [header: string]: (string | number | boolean)[] };
  body: string;
  isBase64Encoded?: boolean;

  constructor(options: Options) {
    const {
      body,
      statusCode,
      headers,
      isBase64Encoded,
      multiValueHeaders,
    } = options;
    this.statusCode = statusCode;
    this.body = JSON.stringify(body);
    this.headers = headers;
    this.isBase64Encoded = isBase64Encoded;
    this.multiValueHeaders = multiValueHeaders;
  }

  public setBody(body: Record<string, any>): void {
    this.body = JSON.stringify(body);
  }

  public setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }
}
