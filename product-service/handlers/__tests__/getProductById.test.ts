import { getProductById } from '../getProductById/api';
import { HttpError } from '../../utils/HttpError';

describe('getProductById spec', () => {
  test('should return product by id', async () => {
    const desiredProduct = {
      count: 4,
      description: 'Short Product Description1',
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      price: 2.4,
      title: 'ProductOne',
    };
    const product = await getProductById(
      '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
    );
    expect(product).toStrictEqual(desiredProduct);
  });

  test('should throw error if id not valid', async () => {
    try {
      await getProductById('');
    } catch (e) {
      expect(e).toStrictEqual(new HttpError('Product not found', 400));
    }
  });

  test('should throw error if product not found', async () => {
    try {
      await getProductById('4da9d9f7-4c3f-4eb6-9bdd-c130571d9817');
    } catch (e) {
      expect(e).toStrictEqual(new HttpError('Product not found', 400));
    }
  });
});
