import { S3Handler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { ApiGatewayError } from '../../../utils/ApiGatewayError';
import { importFileParserService } from './importFileParser.service';

export const importFileParser: S3Handler = async (event, context, callback) => {
  console.log('event', event);
  try {
    for (const record of event.Records) {
      console.log('Record: ', record);
      const {
        bucket: { name: bucketName },
        object: { key, eTag },
      } = record.s3;
      const parsedCsv = await importFileParserService({ bucketName, key });

      const sqs = new SQS();
      parsedCsv.forEach((csv) => {
        console.log(`start of sending message ${JSON.stringify(csv)} to SQS`);
        sqs.sendMessage(
          {
            QueueUrl:
              'https://sqs.eu-west-1.amazonaws.com/457593704115/catalogBatchProcess',
            MessageBody: JSON.stringify(csv),
          },
          (err, data) => {
            if (err) {
              console.log('error in send message to SQS', err);
            } else {
              console.log('data of message to SQS', data);
            }
          }
        );
        console.log(`end of sending message ${JSON.stringify(csv)} to SQS`);
      });
    }
  } catch (e) {
    return ApiGatewayError.handleError(e);
  }
};
