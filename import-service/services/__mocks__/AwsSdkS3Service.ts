import { S3 } from 'aws-sdk';
import AWS from 'aws-sdk-mock';

AWS.mock(
  'S3',
  'getSignedUrlPromise',
  async (params: { operationType: string; Expires: number; Key: string }) => {
    const { Expires, Key, operationType } = params;
    return Buffer.from(Key + operationType + Expires.toString()).toString(
      'base64'
    );
  }
);

type Options = S3.ClientConfiguration & {
  bucketName: string;
};

type GetSignedUrlParams = {
  Expires?: number;
  Key: string;
  operationType: 'putObject' | 'getObject';
};

type CopyObjectParams = S3.CopyObjectRequest;

type GetObjectParams = Omit<S3.GetObjectRequest, 'Bucket'>;

type DeleteObjectParams = S3.DeleteObjectRequest;

export class AwsSdkS3Service {
  private bucketName: string;

  private s3: S3;

  constructor(options: Options) {
    const { bucketName, ...s3ClientConfiguration } = options;
    this.bucketName = options.bucketName;
    this.s3 = new S3(s3ClientConfiguration);
  }

  public async getSignedUrl(params: GetSignedUrlParams): Promise<string> {
    const { operationType, Key, Expires } = params;
    return Buffer.from(
      this.bucketName + Key + operationType + Expires.toString()
    ).toString('base64');
  }

  public async getObject(getObjectParams: GetObjectParams) {
    return this.s3.getObject({ Bucket: this.bucketName, ...getObjectParams });
  }

  public async copyObject(copyObjectParams: CopyObjectParams) {
    return this.s3.copyObject(copyObjectParams).promise();
  }

  public async deleteObject(deleteObjectParams: DeleteObjectParams) {
    return this.s3.deleteObject(deleteObjectParams).promise();
  }
}
