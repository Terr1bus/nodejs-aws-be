import { products } from '../products';
import { validate } from 'uuid';

import { HttpError } from '../../utils/HttpError';
import { Product } from '../types';

const productNotFoundError = new HttpError('Product not found', 400);

export const getProductById = async (id: string): Promise<Product> => {
  if (!validate(id)) {
    throw productNotFoundError;
  }
  const desiredProduct = products.find((product) => product.id === id);

  if (!desiredProduct) {
    productNotFoundError;
  }

  return desiredProduct;
};
