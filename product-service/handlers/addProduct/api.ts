import { Client } from 'pg';
import { Database } from '../../db/Database';
import { Product } from '../../../types';

type ProductForInsert = Omit<Product, 'id'>;

export const addProductToDb = async (
  product: ProductForInsert
): Promise<Product> => {
  let client: Client;
  try {
    client = await new Database().getConnection();
    const { description = null, price, title, count } = product;
    console.log('🚀 ~ file: api.ts ~ line 14 ~ product', product);
    await client.query('BEGIN');
    const insertProductQueryResult = await client.query<{ id: string }>(
      'INSERT INTO products (title, price, description) values ($1, $2, $3) RETURNING id',
      [title, price, description]
    );
    const insertedProductId = insertProductQueryResult.rows?.[0]?.id;
    await client.query(
      'INSERT INTO stock (product_id, count) VALUES ($1, $2)',
      [insertedProductId, count]
    );
    const newProduct = await client.query<Product>(
      'SELECT id, title, price, count, description FROM products LEFT JOIN stock ON products.id=stock.product_id WHERE id=$1',
      [insertedProductId]
    );
    await client.query('COMMIT');
    return newProduct.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('addProduct api error: ', e);
    throw e;
  } finally {
    client.end();
  }
};
