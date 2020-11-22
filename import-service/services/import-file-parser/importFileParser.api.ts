import { S3Handler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { ApiGatewayError } from '../../../utils/ApiGatewayError';
import { importFileParserService } from './importFileParser.service';

export const importFileParser: S3Handler = async (event, context, callback) => {
  console.log('🚀 ~ file: importFileParser.api.ts ~ line 7 ~ event', event);
  try {
    for (const record of event.Records) {
      console.log(
        '🚀 ~ file: importFileParser.api.ts ~ line 10 ~ record',
        record
      );
      const {
        bucket: { name: bucketName },
        object: { key, eTag },
      } = record.s3;
      const parsedCsv = await importFileParserService({ bucketName, key });

      const sqs = new SQS();
      await Promise.all(
        parsedCsv.map(async (csvRecord) => {
          console.log(
            '🚀 ~ file: importFileParser.api.ts ~ line 23 ~ csvRecord',
            csvRecord
          );
          console.log(
            `start of sending message ${JSON.stringify(csvRecord)} to SQS`
          );
          const sqsUrl = process.env.SQS_URL;
          await sqs
            .sendMessage(
              {
                QueueUrl: sqsUrl,
                MessageBody: JSON.stringify(csvRecord),
              },
              (err, data) => {
                if (err) {
                  console.log('error in send message to SQS', err);
                } else {
                  console.log('data of message to SQS', data);
                }
              }
            )
            .promise();
          console.log(
            `end of sending message ${JSON.stringify(csvRecord)} to SQS`
          );
        })
      );
    }
  } catch (e) {
    return ApiGatewayError.handleError(e);
  }
};
