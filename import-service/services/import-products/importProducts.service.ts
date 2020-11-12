import { HttpError } from '../../../utils/HttpError';
import { AwsSdkS3Service } from '../AwsSdkS3Service';

const bucketName = 'import-service-files';
const uploadedDirKey = 'uploaded/';
const parsedDirKey = 'parsed/';

export const getFileUploadSignedUrl = async (
  fileName: string
): Promise<string> => {
  try {
    const Key = uploadedDirKey + fileName;
    const signedUrl = await new AwsSdkS3Service({
      bucketName,
      signatureVersion: 'v4',
    }).getSignedUrl({
      operationType: 'putObject',
      Expires: 60,
      Key,
    });
    return signedUrl;
  } catch (e) {
    throw new HttpError({
      message: 'Something went wrong',
      code: 500,
      meta: e,
    });
  }
};
