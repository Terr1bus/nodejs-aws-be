import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayError } from '../../../utils/ApiGatewayError';
import { ApiGatewayResult } from '../../../utils/ApiGatewayResult';
import { HttpError } from '../../../utils/HttpError';
import { addProductToDb } from './api';

export const addProduct: APIGatewayProxyHandler = async (
  event,
  _context,
  callback
) => {
  try {
    console.log('🚀 ~ file: handler.ts ~ line 14 ~ event', event);
    const parsedBody = JSON.parse(event.body);
    console.log('🚀 ~ file: handler.ts ~ line 15 ~ parsedBody', parsedBody);
    if (parsedBody === null) {
      throw new HttpError({ message: 'Invalid data', code: 400 });
    }
    const addedProduct = await addProductToDb(parsedBody);
    const result = new ApiGatewayResult({
      body: { data: { product: addedProduct } },
      statusCode: 200,
    });
    return result;
  } catch (e) {
    console.log('addProduct handler error: ', e);
    const error = ApiGatewayError.handleError(e);
    return error;
  }
};
