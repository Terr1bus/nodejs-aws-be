import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayResult } from '../../utils/ApiGatewayResult';
import { HttpError } from '../../utils/HttpError';
import { getProductById } from './api';

export const getProduct: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const product = await getProductById(event.pathParameters.id);
    const response = new ApiGatewayResult({
      statusCode: 200,
      body: { data: { product } },
    }).addCors();
    return response;
  } catch (e) {
    const response = new ApiGatewayResult({
      statusCode: 500,
      body: { message: 'Something went wrong' },
    });
    if (e instanceof HttpError) {
      response.setBody({ message: e.message });
      response.setStatusCode(e.code);
      return response;
    }
    return response;
  }
};
