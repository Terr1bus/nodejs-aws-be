import { SNS } from 'aws-sdk';

export class SNSService {
  private sns: SNS;

  constructor(options?: SNS.ClientConfiguration) {
    this.sns = new SNS(options);
  }

  public async publish({ Message, TopicArn }: SNS.PublishInput) {
    return this.sns.publish({ Message, TopicArn }).promise();
  }
}
