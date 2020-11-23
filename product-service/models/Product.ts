import { Client } from 'pg';
import { IProduct } from '../../types';
import { BaseModel } from './BaseModel';
import { AddProductData } from './types';

const addProductText =
  'INSERT INTO products (title, price, description) values ($1, $2, $3) RETURNING id';

const getProductText =
  'SELECT id, title, price, count, description FROM products LEFT JOIN stock ON products.id=stock.product_id WHERE id=$1';

const addProductToStockText =
  'INSERT INTO stock (product_id, count) VALUES ($1, $2)';

export class Product extends BaseModel {
  constructor(client: Client) {
    super(client);
  }

  public async addProduct({
    price,
    title,
    description,
    count,
  }: AddProductData): Promise<IProduct> {
    try {
      await this.client.query('BEGIN');
      const addProductResult = await this.client.query<{ id: string }>(
        addProductText,
        [title, price, description]
      );
      const newProductId = addProductResult.rows[0].id;

      await this.client.query(addProductToStockText, [newProductId, count]);
      await this.client.query('COMMIT');

      const newProduct = await this.getProduct(newProductId);

      return newProduct;
    } catch (e) {
      this.client.query('ROLLBACK');
      throw e;
    } finally {
      this.client.end();
    }
  }

  public async getProduct(id: string): Promise<IProduct> {
    const getProductResult = await this.client.query<IProduct>(getProductText, [
      id,
    ]);
    return getProductResult.rows[0];
  }
}
