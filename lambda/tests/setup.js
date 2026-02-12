// Jest setup file for Lambda tests
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.AWS_REGION = 'eu-west-1';
process.env.TASKS_TABLE = 'test-tasks-table';
process.env.USERS_TABLE = 'test-users-table';
process.env.SES_SENDER_EMAIL = 'test@amalitech.com';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock AWS SDK globally
jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({})
        }),
        get: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Item: {}
          })
        }),
        query: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Items: []
          })
        }),
        update: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({})
        }),
        delete: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({})
        }),
        scan: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Items: []
          })
        })
      }))
    },
    SES: jest.fn(() => ({
      sendEmail: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          MessageId: 'test-message-id'
        })
      })
    })),
    CognitoIdentityServiceProvider: jest.fn(() => ({
      adminCreateUser: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      }),
      adminSetUserPassword: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      }),
      adminGetUser: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          UserAttributes: []
        })
      }),
      initiateAuth: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          AuthenticationResult: {
            IdToken: 'test-id-token',
            AccessToken: 'test-access-token',
            RefreshToken: 'test-refresh-token'
          }
        })
      })
    }))
  };
});

// Suppress console output during tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging test failures
  error: console.error
};

// Global test utilities
global.createMockEvent = (data) => {
  return {
    requestContext: {
      authorizer: {
        claims: {
          sub: 'test-user-id',
          email: 'test@amalitech.com',
          'custom:role': 'admin'
        }
      }
    },
    body: typeof data === 'string' ? data : JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    path: '/test'
  };
};

global.createMockContext = () => {
  return {
    awsRequestId: 'test-request-id',
    functionName: 'test-function',
    memoryLimitInMB: '128',
    logGroupName: '/aws/lambda/test-function',
    logStreamName: 'test-stream',
    getRemainingTimeInMillis: () => 30000
  };
};

// Cleanup after all tests
afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
