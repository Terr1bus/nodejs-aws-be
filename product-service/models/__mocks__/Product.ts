import { Client } from 'pg';
import { IProduct } from '../../../types';
import { AddProductData } from '../types';

export class Product {
  constructor(client: Client) {}

  public addProduct = jest.fn(
    ({ price, title, description, count }: AddProductData): IProduct => {
      return { price, title, description, count, id: '' };
    }
  );
  // public async addProduct({
  //   price,
  //   title,
  //   description,
  //   count,
  // }: AddProductData): Promise<IProduct> {
  //   return { price, title, description, count, id: '' };
  // }
}
