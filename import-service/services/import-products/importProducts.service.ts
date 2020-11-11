import { S3 } from 'aws-sdk';
import { HttpError } from '../../../utils/HttpError';

const bucketName = 'import-service-files';
const uploadedDirKey = 'uploaded/';
const parsedDirKey = 'parsed/';

export const getFileUploadSignedUrl = async (
  fileName: string
): Promise<string> => {
  try {
    const s3 = new S3({
      signatureVersion: 'v4',
    });
    const Key = uploadedDirKey + fileName;
    const params = {
      Bucket: bucketName,
      Expires: 60,
      Key,
    };
    console.log({ params });
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return signedUrl;
  } catch (e) {
    throw new HttpError({
      message: 'Something went wrong',
      code: 500,
      meta: e,
    });
  }
};
