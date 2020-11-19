import csvParser from 'csv-parser';
import { AwsSdkS3Service } from '../AwsSdkS3Service';
import { parsedDirKey } from '../constants';

type ImportFileParserServiceParams = {
  bucketName: string;
  key: string;
};

export const importFileParserService = async (
  params: ImportFileParserServiceParams
): Promise<string[]> => {
  try {
    return new Promise(async (resolve, reject) => {
      const result: string[] = [];
      const { bucketName, key } = params;
      const s3 = new AwsSdkS3Service({ bucketName });
      const s3Object = await s3.getObject({ Key: key });
      console.log('s3Object', s3Object);
      const rStream = s3Object.createReadStream();
      rStream
        .pipe(csvParser())
        .on('data', (chunk) => {
          console.log('parsed chunk: ', chunk);
          result.push(chunk);
        })
        .on('error', (err) => {
          console.log('error', err);
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
          console.log('result', result);
          resolve(result);
        });
    });
  } catch (e) {
    throw e;
  }
};
