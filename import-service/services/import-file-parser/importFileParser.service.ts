import csvParser from 'csv-parser';
import { Product } from '../../../types';
import { AwsSdkS3Service } from '../AwsSdkS3Service';
import { parsedDirKey } from '../constants';
import { castProductRecord } from './utils';

type ImportFileParserServiceParams = {
  bucketName: string;
  key: string;
};

export const importFileParserService = async (
  params: ImportFileParserServiceParams
): Promise<Product[]> => {
  try {
    return new Promise(async (resolve, reject) => {
      const result: Product[] = [];
      const { bucketName, key } = params;
      const s3 = new AwsSdkS3Service({ bucketName });
      const s3Object = await s3.getObject({ Key: key });
      console.log(
        '🚀 ~ file: importFileParser.service.ts ~ line 19 ~ s3Object',
        s3Object
      );
      const rStream = s3Object.createReadStream();
      rStream
        .pipe(csvParser())
        .on('data', (chunk) => {
          console.log(
            '🚀 ~ file: importFileParser.service.ts ~ line 24 ~ chunk',
            chunk
          );
          const castedProduct = castProductRecord(chunk);
          console.log(
            '🚀 ~ file: importFileParser.service.ts ~ line 33 ~ castedProduct',
            castedProduct
          );
          result.push(castedProduct);
        })
        .on('error', (err) => {
          console.log(
            '🚀 ~ file: importFileParser.service.ts ~ line 34 ~ err',
            err
          );
          reject();
        })
        .on('end', async () => {
          console.log('stream finished');
          const destinationObjectKey = parsedDirKey + key.split('/')[1];
          console.log({ destinationObjectKey, key, bucketName });
          await s3.copyObject({
            CopySource: bucketName + '/' + key,
            Bucket: bucketName,
            Key: destinationObjectKey,
          });
          await s3.deleteObject({ Bucket: bucketName, Key: key });
          console.log(
            '🚀 ~ file: importFileParser.service.ts ~ line 51 ~ result',
            result
          );
          resolve(result);
        });
    });
  } catch (e) {
    throw e;
  }
};
