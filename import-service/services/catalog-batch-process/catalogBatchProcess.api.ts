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

        const snsTopicArn = process.env.SNS_TOPIC_ARN;
        console.log(
          '🚀 ~ file: catalogBatchProcess.api.ts ~ line 53 ~ event.Records.map ~ snsTopicArn',
          snsTopicArn
        );
        return sns
          .publish(
            {
              Message: `product was created: ${record.body}`,
              MessageAttributes: {},
              TopicArn: snsTopicArn,
            },
            (err, data) => {
              if (err) {
                console.log(
                  '🚀 ~ file: catalogBatchProcess.api.ts ~ line 38 ~ event.Records.map ~ err',
                  err
                );
              }
              console.log(
                '🚀 ~ file: catalogBatchProcess.api.ts ~ line 40 ~ event.Records.map ~ data',
                data
              );
            }
          )
          .promise();
      })
    );
  } catch (e) {
    console.log('error', e);
  }
};
