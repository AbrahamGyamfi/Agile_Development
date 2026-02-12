import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import TaskList from '../components/TaskList';

const AdminDashboard = ({ tasks, userRole, filterStatus, setFilterStatus, updateTaskStatus, deleteTask, loading }) => {
  const navigate = useNavigate();

  return (
    <>
      <Dashboard tasks={tasks} />
      
      <div className="dashboard-actions">
        <button className="create-task-btn" onClick={() => navigate('/create-task')}>
          <span className="btn-icon">+</span> Create New Task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        userRole={userRole}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onStatusChange={updateTaskStatus}
        onDelete={deleteTask}
        loading={loading}
      />
    </>
  );
};

export default AdminDashboard;
