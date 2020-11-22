import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },

  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    SQS_URL: {
      Ref: 'SQS',
    },
    SQS_ARN: {
      'Fn::GetAtt': ['SQS', 'Arn'],
    },
    SNS_TOPIC_ARN: {
      Ref: 'SNSTopic',
    },
  },

  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],

  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${self:custom.SQS_URL}',
      SNS_TOPIC_ARN: '${self:custom.SNS_TOPIC_ARN}',
    },

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: '${self:custom.SQS_ARN}',
      },
      {
        Effect: 'Allow',
        Action: 'SNS:*',
        Resource: '${self:custom.SNS_TOPIC_ARN}',
      },
    ],
  },

  resources: {
    Resources: {
      SQS: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogBatchProcess',
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'SNS Topic',
          TopicName: 'createProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          TopicArn: '${self:custom.SNS_TOPIC_ARN}',
          Endpoint: '${env:SNS_SUBSCRIPTION_ENDPOINT_EMAIL}',
        },
      },
    },
  },

  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
            cors: true,
          },
        },
      ],
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            event: 's3:ObjectCreated:*',
            bucket: 'import-service-files',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '.csv',
              },
            ],
            existing: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            arn: '${self:custom.SQS_ARN}',
            batchSize: 5,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
