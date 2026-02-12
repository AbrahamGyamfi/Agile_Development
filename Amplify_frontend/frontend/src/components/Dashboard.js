import React from 'react';

const Dashboard = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const uncompletedTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{totalTasks}</h3>
          <p>Total Assigned</p>
        </div>
        <div className="stat-card completed">
          <h3>{completedTasks}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card uncompleted">
          <h3>{uncompletedTasks}</h3>
          <p>Uncompleted</p>
        </div>
      </div>
      
      {totalTasks > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span className="progress-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
