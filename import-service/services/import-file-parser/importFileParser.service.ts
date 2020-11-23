import util from 'util';
import csvParser from 'csv-parser';
import stream from 'stream';

import { IProduct } from '../../../types';
import { AwsSdkS3Service } from '../../../aws-sdk';
import { parsedDirKey } from '../constants';
import { castProductRecord } from './utils';

const asyncPipeline = util.promisify(stream.pipeline);

type ImportFileParserServiceParams = {
  bucketName: string;
  key: string;
};

export const importFileParserService = async (
  params: ImportFileParserServiceParams
): Promise<IProduct[]> => {
  try {
    return new Promise(async (resolve, reject) => {
      const result: IProduct[] = [];
      const { bucketName, key } = params;
      const s3 = new AwsSdkS3Service({ bucketName });
      const s3Object = await s3.getObject({ Key: key });
      console.log(
        '🚀 ~ file: importFileParser.service.ts ~ line 19 ~ s3Object',
        s3Object
      );

      const rStream = s3Object.createReadStream();
      const processCsvChunk = (chunk: any): void => {
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
      };

      const onStreamError = (err: Error): void => {
        console.log(
          '🚀 ~ file: importFileParser.service.ts ~ line 34 ~ err',
          err
        );
        reject();
      };

      const onStreamEnd = async () => {
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
      };

      const transformStream = new stream.Transform().on(
        'data',
        processCsvChunk
      );
      // await asyncPipeline(rStream, csvParser(), transformStream);
      rStream
        .pipe(csvParser())
        .on('data', processCsvChunk)
        .on('error', onStreamError)
        .on('end', onStreamEnd);
    });
  } catch (e) {
    throw e;
  }
};
