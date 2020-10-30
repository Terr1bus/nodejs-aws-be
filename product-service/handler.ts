import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getAllProductsFromDb } from './handlers';
import { getProductById } from './handlers';
import { ApiGatewayResult } from './utils/ApiGatewayResult';
import { HttpError } from './utils/HttpError';

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Access-Control-Allow-Credentials': true,
};

export const getProduct: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const product = await getProductById(event.pathParameters.id);
    const response = new ApiGatewayResult({
      statusCode: 200,
      body: { data: { product } },
      headers: corsHeaders,
    });
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
      headers: corsHeaders,
    });
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
