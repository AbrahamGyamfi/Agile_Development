import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

const CreateTask = ({ createTask, loading }) => {
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignedTo: [], 
    dueDate: '', 
    priority: 'medium' 
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const result = await createTask(newTask);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="create-task-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <h1>Create New Task</h1>
      </div>
      
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        onSubmit={handleCreateTask}
        loading={loading}
      />
    </div>
  );
};

export default CreateTask;