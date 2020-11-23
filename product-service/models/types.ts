import { IProduct } from '../../types';

export type AddProductData = Pick<
  IProduct,
  'description' | 'price' | 'title' | 'count'
>;
