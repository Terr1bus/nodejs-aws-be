import { S3Handler } from 'aws-lambda';
import { ApiGatewayError } from '../../../utils/ApiGatewayError';
import { importFileParserService } from './importFileParser.service';

export const importFileParser: S3Handler = async (event) => {
  try {
    console.log({ event });
    for (const record of event.Records) {
      console.log('Record: ', record);
      const {
        bucket: { name: bucketName },
        object: { key, eTag },
      } = record.s3;
      await importFileParserService({ bucketName, key });
    }
  } catch (e) {
    return ApiGatewayError.handleError(e);
  }
};
