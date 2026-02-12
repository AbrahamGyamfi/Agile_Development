import { Auth } from 'aws-amplify';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Get the authentication token for API requests
 */
const getAuthToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

/**
 * Fetch all tasks from the API
 */
export const fetchTasks = async () => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  const data = await response.json();
  return data.tasks || [];
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo.filter(email => email.trim()),
      dueDate: taskData.dueDate,
      priority: taskData.priority
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create task');
  }

  return await response.json();
};

/**
 * Update task status
 */
export const updateTaskStatus = async (taskId, status) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ taskId, status })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task');
  }

  return await response.json();
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete task');
  }

  return await response.json();
};

/**
 * Update a task
 */
export const updateTask = async (taskId, taskData) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo.filter(email => email.trim()),
      dueDate: taskData.dueDate,
      priority: taskData.priority
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task');
  }

  return await response.json();
};
