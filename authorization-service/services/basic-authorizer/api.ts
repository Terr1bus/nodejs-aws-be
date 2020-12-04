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
    const envPassword = process.env[username];
    const effect: Effect =
      envPassword && process.env[username] === password ? 'Allow' : 'Deny';
    console.log('🚀 ~ file: api.ts ~ line 33 ~ effect', effect);
    return callback(
      null,
      generatePolicy(event.authorizationToken, event.methodArn, effect)
    );
  } catch (e) {
    console.log('🚀 ~ file: api.ts ~ line 53 ~ e', e);
    return callback(`Unauthorized`);
  }
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
  console.log('🚀 ~ file: api.ts ~ line 64 ~ policy', JSON.stringify(policy));
  return policy;
};
