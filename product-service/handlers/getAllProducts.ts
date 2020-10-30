import { products } from './products';
import { Product } from './types';

type SortOrder = 'ASC' | 'DESC';

type ProductSortColumns = 'description' | 'price' | 'title';

type Sort = {
  column: ProductSortColumns;
  order: SortOrder;
};

type Options = {
  page?: number;
  count?: number;
  offset?: number;
  sort?: Sort;
};

const defaultOptions: Options = {
  count: 10,
  offset: 0,
  page: 0,
  sort: {
    column: 'title',
    order: 'ASC',
  },
};

export const getAllProductsFromDb = async (
  options = defaultOptions
): Promise<Product[]> => {
  const { count, offset, page, sort } = options;
  return products;
};
