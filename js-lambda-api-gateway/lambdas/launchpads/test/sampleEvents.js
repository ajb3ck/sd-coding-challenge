export const defaultEvent = {
  body: 'eyJ0ZXN0IjoiYm9keSJ9',
  resource: '/{proxy+}',
  path: '/path/to/resource',
  httpMethod: 'POST',
  isBase64Encoded: true,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  headers: null,
  multiValueHeaders: null,
  requestContext: {
    accountId: '123456789012',
    resourceId: '123456',
    stage: 'prod',
    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
    requestTime: '09/Apr/2015:12:34:56 +0000',
    requestTimeEpoch: 1428582896000,
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      accessKey: null,
      sourceIp: '127.0.0.1',
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Custom User Agent String',
      user: null,
    },
    path: '/launchpads',
    resourcePath: '/launchpads',
    httpMethod: 'POST',
    apiId: '1234567890',
    protocol: 'HTTP/1.1',
  },
};