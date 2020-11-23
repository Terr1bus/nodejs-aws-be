import { Database } from '../../db/Database';
import { IProduct } from '../../../types';
import { Product } from '../../models/Product';

type ProductForInsert = Omit<IProduct, 'id'>;

export const addProductToDb = async (
  product: ProductForInsert
): Promise<IProduct> => {
  try {
    const client = await new Database().getConnection();
    const { description = null, price, title, count } = product;
    console.log('🚀 ~ file: api.ts ~ line 14 ~ product', product);
    const newProduct = await new Product(client).addProduct({
      price,
      title,
      description,
      count,
    });
    return newProduct;
  } catch (e) {
    console.log('addProduct api error: ', e);
    throw e;
  }
};
