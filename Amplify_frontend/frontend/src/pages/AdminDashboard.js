import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import Dashboard from '../components/Dashboard';
// eslint-disable-next-line no-unused-vars
import TaskList from '../components/TaskList';

const AdminDashboard = ({ tasks, userRole, filterStatus, setFilterStatus }) => {
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
      />
    </>
  );
};

export default AdminDashboard;
