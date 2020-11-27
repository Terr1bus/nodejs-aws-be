import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import { Database } from '../../db/Database';
import { Product } from '../../models/Product';

import { AddProductData } from '../../models/types';
import { catalogBatchProcess } from '../catalog-batch-process';

jest.mock('../../../aws-sdk/SNSService.ts');
jest.mock('../../db/Database.ts');
jest.mock('../../models/Product.ts');

describe('catalog-batch-process', () => {
  describe('api', () => {
    describe('catalogBatchProcess', () => {
      const product: AddProductData = {
        count: 5,
        price: 10,
        title: 'title',
        description: 'description',
      };

      const getSqsRecord = (body: Record<string, unknown>): SQSRecord =>
        ({
          get body() {
            return JSON.stringify(body);
          },
        } as SQSRecord);

      test('should throw validation error if product not valid', async () => {
        const record1 = getSqsRecord({ some: 1 });
        const sqsEvent: SQSEvent = {
          Records: [record1],
        };
        try {
          await catalogBatchProcess(sqsEvent, {} as Context, () => {});
        } catch (e) {
          expect(e).toBeTruthy();
        }
      });

      test('should call each body in record one time', async () => {
        const record1 = getSqsRecord(product);
        const record2 = getSqsRecord(product);
        const spy1 = jest.spyOn(record1, 'body', 'get');
        const spy2 = jest.spyOn(record2, 'body', 'get');
        const sqsEvent: SQSEvent = {
          Records: [record1, record2],
        };
        try {
          await catalogBatchProcess(sqsEvent, {} as Context, () => {});
        } catch (e) {
          expect(e).toBeFalsy();
        }
        expect(spy1).toBeCalledTimes(1);
        expect(spy2).toBeCalledTimes(1);
      });

      // test('should call addProduct method on Product model', async () => {
      //   const client = await new Database().getConnection();
      //   const productModel = new Product(client);

      //   const record1 = getSqsRecord(product);
      //   const sqsEvent: SQSEvent = {
      //     Records: [record1],
      //   };

      //   const addProduct = jest.fn();
      //   productModel.addProduct = addProduct;

      //   const getProduct = jest.fn();
      //   productModel.getProduct = getProduct;
      //   try {
      //     await catalogBatchProcess(sqsEvent, {} as Context, () => {});
      //   } catch (e) {
      //     expect(e).toBeFalsy();
      //   }
      //   expect(productModel.addProduct).toBeCalledTimes(1);
      //   expect(productModel.getProduct).toBeCalledTimes(1);
      // });
    });
  });
});
