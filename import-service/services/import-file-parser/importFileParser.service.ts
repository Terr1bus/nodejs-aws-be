import { AwsSdkS3Service } from '../AwsSdkS3Service';

type ImportFileParserServiceParams = {
  bucketName: string;
  key: string;
};

export const importFileParserService = async (
  params: ImportFileParserServiceParams
) => {
  const { bucketName, key } = params;
  const s3 = new AwsSdkS3Service({ bucketName });
  const object = await s3.getObject({ Key: key });
  console.log({ object });
};
