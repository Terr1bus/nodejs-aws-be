import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayError } from '../../utils/ApiGatewayError';
import { ApiGatewayResult } from '../../utils/ApiGatewayResult';
import { HttpError } from '../../utils/HttpError';
import { addProductToDb } from './api';

export const addProduct: APIGatewayProxyHandler = async (
  event,
  _context,
  callback
) => {
  try {
    console.log({ event });
    const parsedBody = JSON.parse(event.body);
    if (parsedBody === null) {
      throw new HttpError('Invalid data', 400);
    }
    const { count, description, price, title } = parsedBody;
    const addedProduct = await addProductToDb({
      count,
      price,
      title,
      description,
    });
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
