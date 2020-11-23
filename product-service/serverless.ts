import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
    SNS_TOPIC_ARN: {
      Ref: 'SNSTopic',
    },
    SQS_ARN: '${cf:import-service-${self:provider.stage}.sqsArn}',
  },

  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],

  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: '${env:DB_HOST}',
      DB_PORT: '${env:DB_PORT}',
      DB_NAME: '${env:DB_NAME}',
      DB_USERNAME: '${env:DB_USERNAME}',
      DB_PASSWORD: '${env:DB_PASSWORD}',
      SNS_TOPIC_ARN: '${self:custom.SNS_TOPIC_ARN}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'SNS:*',
        Resource: '${self:custom.SNS_TOPIC_ARN}',
      },
    ],
  },

  functions: {
    getProductById: {
      handler: 'lambdas.getProduct',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
          },
        },
      ],
    },
    getProductsList: {
      handler: 'lambdas.getProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    addProduct: {
      handler: 'lambdas.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'lambdas.catalogBatchProcess',
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

  resources: {
    Resources: {
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
      SNSSubscriptionWithFilter: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          TopicArn: '${self:custom.SNS_TOPIC_ARN}',
          Endpoint: '${env:SNS_SUBSCRIPTION_ENDPOINT_EMAIL_WITH_FILTER}',
          FilterPolicy: JSON.stringify({ price: [{ numeric: ['<', 200] }] }),
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
