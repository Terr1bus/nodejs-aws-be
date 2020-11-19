import superagent from 'superagent';
import { SQSHandler } from 'aws-lambda';

export const catalogBatchProcess: SQSHandler = async (
  event,
  context,
  callback
) => {
  try {
    console.log('event', event);
    await Promise.all(
      event.Records.map((record) => {
        console.log('record', record);
        return superagent
          .post(
            'https://pp6vr2duqa.execute-api.eu-west-1.amazonaws.com/dev/products'
          )
          .send(record.body);
      })
    );
  } catch (e) {
    console.log('error', e);
  }
};
