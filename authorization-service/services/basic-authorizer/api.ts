import {
  APIGatewayAuthorizerCallback,
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';

export const basicAuthorizer: APIGatewayAuthorizerHandler = (
  event,
  _context,
  callback
) => {
  console.log('🚀 ~ file: api.ts ~ line 12 ~ event', event);
  if (event.type !== 'TOKEN') {
    return callback('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;
    const encodedUserCreds = authorizationToken.split(' ')[1];
    console.log(
      '🚀 ~ file: api.ts ~ line 27 ~ encodedUserCreds',
      encodedUserCreds
    );
    const userCreds = Buffer.from(encodedUserCreds, 'base64').toString('utf8');
    console.log('🚀 ~ file: api.ts ~ line 28 ~ userCreds', userCreds);
    const [username, password] = userCreds.split(':');
    console.log('🚀 ~ file: api.ts ~ line 30 ~ username', username);
    console.log('🚀 ~ file: api.ts ~ line 30 ~ password', password);
    if (!username || !password) {
      throw new Error('username or password not valid');
    }
    const effect: Effect =
      process.env[username] === password ? 'Allow' : 'Deny';
    return callback(
      null,
      generatePolicy(event.authorizationToken, event.methodArn, effect)
    );
  } catch (e) {
    return callback(`Unauthorized ${e.message}`);
  }

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message:
  //         'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };
};

type Effect = 'Allow' | 'Deny';

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: Effect = 'Allow'
): APIGatewayAuthorizerResult => {
  const policy: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
  console.log('🚀 ~ file: api.ts ~ line 64 ~ policy', policy);
  return policy;
};
