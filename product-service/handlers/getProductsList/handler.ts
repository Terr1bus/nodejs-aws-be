import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayResult } from '../../utils/ApiGatewayResult';
import { HttpError } from '../../utils/HttpError';
import { getAllProductsFromDb } from './api';

export const getProducts: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const products = await getAllProductsFromDb();
    const response = new ApiGatewayResult({
      statusCode: 200,
      body: {
        data: {
          products,
        },
      },
    }).addCors();
    return response;
  } catch (e) {
    const response = new ApiGatewayResult({
      statusCode: 500,
      body: { message: e?.message ?? 'Something went wrong' },
    });
    if (e instanceof HttpError) {
      response.setBody({ message: e.message });
      response.setStatusCode(e.code);
      return response;
    }
    return response;
  }
};
