import { useState, useEffect } from 'react';
import * as taskService from '../services/taskService';

export const useTasks = (user, userRole) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.fetchTasks();
      
      // Filter tasks for members - show only assigned tasks
      if (userRole === 'member' && user) {
        const userEmail = user.attributes?.email;
        const filtered = fetchedTasks.filter(task => 
          task.assignedMembers?.includes(userEmail)
        );
        setTasks(filtered);
      } else {
        setTasks(fetchedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.createTask(taskData);
      await fetchTasks();
      return { success: true };
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.updateTaskStatus(taskId, status);
      await fetchTasks();
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      await fetchTasks();
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.updateTask(taskId, taskData);
      await fetchTasks();
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    setError,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    updateTask
  };
};
