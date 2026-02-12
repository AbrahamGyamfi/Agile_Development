import React from 'react';
import TaskList from '../components/TaskList';

const MemberDashboard = ({ tasks, userRole, filterStatus, setFilterStatus, updateTaskStatus, loading }) => {
  return (
    <TaskList
      tasks={tasks}
      userRole={userRole}
      filterStatus={filterStatus}
      onFilterChange={setFilterStatus}
      onStatusChange={updateTaskStatus}
      loading={loading}
    />
  );
};

export default MemberDashboard;
