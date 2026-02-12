// eslint-disable-next-line no-unused-vars
import TaskList from '../components/TaskList';

const MemberDashboard = ({ tasks, userRole, filterStatus, setFilterStatus }) => {
  return (
    <TaskList
      tasks={tasks}
      userRole={userRole}
      filterStatus={filterStatus}
      onFilterChange={setFilterStatus}
    />
  );
};

export default MemberDashboard;
