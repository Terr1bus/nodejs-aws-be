import superagent from 'superagent';
import { SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';

export const catalogBatchProcess: SQSHandler = async (
  event,
  context,
  callback
) => {
  console.log('🚀 ~ file: catalogBatchProcess.api.ts ~ line 9 ~ event', event);
  try {
    const sns = new SNS();
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
        await superagent
          .post(
            'https://pp6vr2duqa.execute-api.eu-west-1.amazonaws.com/dev/products'
          )
          .send(body);
        return sns
          .publish({
            Message: `product was created: ${record.body}`,
            TopicArn: process.env.SNS_Topic_ARN,
          })
          .promise();
      })
    );
  } catch (e) {
    console.log('error', e);
  }
};
