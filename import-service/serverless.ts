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
  },

  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],

  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        // Resource: { 'Fn::GetAtt': ['SQS', 'Arn'] },
        Resource: 'arn:aws:sqs:eu-west-1:457593704115:catalogBatchProcess:*',
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
            arn: { 'Fn::GetAtt': ['SQS', 'Arn'] },
            batchSize: 5,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
