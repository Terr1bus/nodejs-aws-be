import { SQSHandler } from 'aws-lambda';
import { SNSService } from '../../../aws-sdk';
import { Database } from '../../db/Database';
import { Product } from '../../models/Product';
import { validateProduct } from '../../utils/validation/productValidation';

const snsTopicArn = process.env.SNS_TOPIC_ARN;
const sns = new SNSService();

export const catalogBatchProcess: SQSHandler = async (event) => {
  console.log('🚀 ~ file: catalogBatchProcess.api.ts ~ line 9 ~ event', event);
  try {
    const client = await new Database().getConnection();
    const productModel = new Product(client);
    await Promise.all(
      event.Records.map(async (record) => {
        console.log(
          '🚀 ~ file: catalogBatchProcess.api.ts ~ line 13 ~ record',
          record
        );
        const body = JSON.parse(record.body);
        console.log(
          '🚀 ~ file: catalogBatchProcess.api.ts ~ line 18 ~ body',
          body
        );
        const validationResult = validateProduct(body);
        if (validationResult.valid === false) {
          throw new Error(
            `validation of ${body} failed with errors: ${validationResult.errors}`
          );
        }
        await productModel.addProduct(body);

        console.log(
          '🚀 ~ file: catalogBatchProcess.api.ts ~ line 53 ~ event.Records.map ~ snsTopicArn',
          snsTopicArn
        );
        return sns.publish({
          Message: `product was created: ${body}`,
          TopicArn: snsTopicArn,
        });
      })
    );
  } catch (e) {
    console.log('error', e);
    throw e;
  }
};
