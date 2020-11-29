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
  },

  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin',
    'serverless-pseudo-parameters',
  ],

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
    },

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: '${self:custom.SQS_ARN}',
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
    Outputs: {
      sqsArn: {
        Value: '${self:custom.SQS_ARN}',
      },
    },
  },

  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            authorizer: {
              type: 'token',
              arn:
                'arn:aws:lambda:${self:provider.region}:${AWS::AccountId}:function:authorization-service-dev-basicAuthorizer',
              identitySource: 'method.request.header.Authorization',
              resultTtlInSeconds: 0,
              name: 'import-service-token-authorizer',
            },
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
  },
};

module.exports = serverlessConfiguration;
