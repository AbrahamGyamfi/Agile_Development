import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import TaskForm from '../components/TaskForm';

const EditTask = ({ tasks, updateTask, loading }) => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const task = tasks.find(t => t.taskId === taskId);

  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    assignedTo: [],
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (task) {
      setEditTask({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedMembers || [],
        dueDate: task.dueDate || '',
        priority: task.priority
      });
    }
  }, [task]);

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const result = await updateTask(taskId, editTask);
    if (result.success) {
      navigate('/');
    }
  };

  if (!task) {
    return (
      <div className="create-task-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <h1>Task not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="create-task-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <h1>Update Task</h1>
      </div>

      <TaskForm
        newTask={editTask}
        setNewTask={setEditTask}
        onSubmit={handleUpdateTask}
        loading={loading}
        isEdit={true}
      />
    </div>
  );
};

export default EditTask;
