import { Database } from '../../db/Database';
import { Product } from '../types';

type ProductForInsert = Omit<Product, 'id'>;

export const addProductToDb = async (
  product: ProductForInsert
): Promise<Product> => {
  try {
    const client = await new Database().getConnection();
    const { count, description, price, title } = product;
    const insertProductQueryResult = client.query(
      'INSERT INTO products (title, price description) VALUES ($1, $2, $3)',
      [title, price, description]
    );
    const insertProductCountQueryResult = client.query(
      'INSERT INTO stock VALUES ($1, $2)',
      [count]
    );
  } catch (e) {
    throw e;
  }
};
