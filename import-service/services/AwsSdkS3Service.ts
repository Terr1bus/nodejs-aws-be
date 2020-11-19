import { S3 } from 'aws-sdk';

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
    const { operationType, ...getSignedUrlParams } = params;
    return this.s3.getSignedUrlPromise(operationType, {
      ...getSignedUrlParams,
      Bucket: this.bucketName,
    });
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
