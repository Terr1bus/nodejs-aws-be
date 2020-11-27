import { importServiceBucketName, uploadedDirKey } from '../../constants';
import { getFileUploadSignedUrl } from '../importProducts.service';

jest.mock('../../../../aws-sdk/AwsSdkS3Service.ts');

describe('getFileUploadSignedUrl spec', () => {
  test('should return signed url', async () => {
    const fileName = 'someName';
    const operationType = 'putObject';
    const expires = 60;
    const expectedSignedUrl = Buffer.from(
      importServiceBucketName +
        uploadedDirKey +
        fileName +
        operationType +
        expires.toString()
    ).toString('base64');
    const signedUrl = await getFileUploadSignedUrl(fileName);
    expect(signedUrl).toBe(expectedSignedUrl);
  });
});
