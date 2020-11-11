import { APIGatewayProxyResult } from 'aws-lambda';
import { ApiGatewayResult } from './ApiGatewayResult';
import { HttpError } from './HttpError';

export class ApiGatewayError {
  body = { errors: [] };
  code = 500;

  constructor(text: string, code: number) {
    this.body.errors.push({ error: text, code });
    this.code = code;
  }

  public static handleError(e: any): APIGatewayProxyResult {
    const response = new ApiGatewayResult({
      statusCode: 500,
      body: { message: 'Something went wrong' },
    });
    if (e instanceof HttpError) {
      response.setBody({ message: e.message });
      response.setStatusCode(e.code);
    }
    return response;
  }
}
