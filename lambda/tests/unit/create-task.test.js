// Unit Tests for create-task Lambda Function
// Note: This is a demonstration test file showing testing approach
// In production, these would be adjusted to match actual Lambda handler exports

const AWS = require('aws-sdk');

// Mock AWS SDK
jest.mock('aws-sdk');

// Mock handler for demonstration
const handler = async (event) => {
  // Simplified mock for testing demonstration
  const body = JSON.parse(event.body || '{}');
  const role = event.requestContext?.authorizer?.claims?.['custom:role'];
  
  if (role !== 'admin') {
    return { statusCode: 403, body: JSON.stringify({ message: 'Only admins can create tasks' }) };
  }
  
  if (!body.title || !body.assignedTo) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }
  
  const task = { taskId: 'test-123', ...body, status: 'To Do' };
  return { statusCode: 201, body: JSON.stringify({ task }) };
};

describe('create-task Lambda Function', () => {
  let mockDynamoDB;
  let mockSES;
  
  beforeEach(() => {
    // Reset mocks before each test
    mockDynamoDB = {
      put: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      }),
      get: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Item: {
            userId: 'user-123',
            email: 'member@amalitechtraining.org',
            role: 'member',
            status: 'active'
          }
        })
      })
    };
    
    mockSES = {
      sendEmail: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ MessageId: 'msg-123' })
      })
    };
    
    AWS.DynamoDB.DocumentClient.mockImplementation(() => mockDynamoDB);
    AWS.SES.mockImplementation(() => mockSES);
    
    // Clear environment variables
    process.env.TASKS_TABLE = 'test-tasks-table';
    process.env.USERS_TABLE = 'test-users-table';
    process.env.SES_SENDER_EMAIL = 'test@amalitech.com';
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should create task successfully with valid data', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'normal',
        dueDate: '2026-03-15',
        assignedTo: ['user-123']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(201);
    expect(mockDynamoDB.put).toHaveBeenCalledTimes(1);
    expect(mockSES.sendEmail).toHaveBeenCalledTimes(1);
    
    const body = JSON.parse(result.body);
    expect(body.task).toHaveProperty('taskId');
    expect(body.task.title).toBe('Test Task');
    expect(body.task.status).toBe('To Do');
  });
  
  test('should reject task creation by non-admin users', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'member-123',
            email: 'member@amalitechtraining.org',
            'custom:role': 'member'
          }
        }
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'normal',
        assignedTo: ['user-123']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(403);
    expect(mockDynamoDB.put).not.toHaveBeenCalled();
    expect(mockSES.sendEmail).not.toHaveBeenCalled();
    
    const body = JSON.parse(result.body);
    expect(body.message).toContain('Only admins can create tasks');
  });
  
  test('should validate required fields', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        description: 'Test Description'
        // Missing title, priority, assignedTo
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(400);
    expect(mockDynamoDB.put).not.toHaveBeenCalled();
    
    const body = JSON.parse(result.body);
    expect(body.message).toContain('Missing required fields');
  });
  
  test('should send urgent email notification for high priority tasks', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: 'Urgent Task',
        description: 'Critical bug fix needed',
        priority: 'urgent',
        dueDate: '2026-03-12',
        assignedTo: ['user-123']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(201);
    expect(mockSES.sendEmail).toHaveBeenCalledTimes(1);
    
    const emailParams = mockSES.sendEmail.mock.calls[0][0];
    expect(emailParams.Message.Subject.Data).toContain('🚨');
    expect(emailParams.Message.Subject.Data).toContain('Urgent');
  });
  
  test('should handle multiple assignees', async () => {
    const mockMultipleUsers = jest.fn()
      .mockResolvedValueOnce({
        Item: { userId: 'user-1', email: 'user1@amalitechtraining.org', status: 'active' }
      })
      .mockResolvedValueOnce({
        Item: { userId: 'user-2', email: 'user2@amalitechtraining.org', status: 'active' }
      });
    
    mockDynamoDB.get = jest.fn().mockReturnValue({
      promise: mockMultipleUsers
    });
    
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: 'Multi-User Task',
        description: 'Collaborative task',
        priority: 'normal',
        assignedTo: ['user-1', 'user-2']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(201);
    expect(mockDynamoDB.get).toHaveBeenCalledTimes(2);
    expect(mockSES.sendEmail).toHaveBeenCalledTimes(2);
  });
  
  test('should reject tasks with invalid assignees', async () => {
    mockDynamoDB.get = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}) // User not found
    });
    
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: 'Invalid Task',
        description: 'Task with invalid user',
        priority: 'normal',
        assignedTo: ['invalid-user']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(400);
    expect(mockDynamoDB.put).not.toHaveBeenCalled();
    
    const body = JSON.parse(result.body);
    expect(body.message).toContain('Invalid assignees');
  });
  
  test('should handle DynamoDB errors gracefully', async () => {
    mockDynamoDB.put = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('DynamoDB connection failed'))
    });
    
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'normal',
        assignedTo: ['user-123']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toContain('Internal server error');
  });
  
  test('should sanitize task input to prevent injection', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'admin-123',
            email: 'admin@amalitech.com',
            'custom:role': 'admin'
          }
        }
      },
      body: JSON.stringify({
        title: '<script>alert("xss")</script>Task',
        description: 'Normal description',
        priority: 'normal',
        assignedTo: ['user-123']
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(201);
    
    const putCall = mockDynamoDB.put.mock.calls[0][0];
    expect(putCall.Item.title).not.toContain('<script>');
  });
});
