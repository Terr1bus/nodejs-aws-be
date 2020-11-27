import { validate } from 'uuid';

import { HttpError } from '../../../utils/HttpError';
import { IProduct } from '../../../types';
import { Database } from '../../db/Database';

export const getProductById = async (id: string): Promise<IProduct> => {
  const productNotFoundError = new HttpError({
    message: 'Product not found',
    code: 400,
  });
  try {
    if (!validate(id)) {
      throw productNotFoundError;
    }
    const client = await new Database().getConnection();

    const queryResult = await client.query<IProduct>(
      'SELECT * FROM products LEFT JOIN stock ON products.id = stock.product_id WHERE id=$1',
      [id]
    );

    if (queryResult.rowCount === 0) {
      throw productNotFoundError;
    }

    const desiredProduct = queryResult.rows?.[0];

    return desiredProduct;
  } catch (e) {
    throw e;
  }
};
