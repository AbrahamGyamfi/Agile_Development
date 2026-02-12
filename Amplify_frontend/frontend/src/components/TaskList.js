// eslint-disable-next-line no-unused-vars
import TaskCard from './TaskCard';

const TaskList = ({
  tasks,
  userRole,
  filterStatus,
  onFilterChange
}) => {
  const getFilteredTasks = () => {
    if (filterStatus === 'all') return tasks;
    return tasks.filter(task => task.status === filterStatus);
  };

  const filteredTasks = getFilteredTasks();

  return (
    <section className="tasks-list">
      <div className="tasks-header">
        <h2>{userRole === 'Admin' ? 'All Tasks' : 'Tasks Assigned'} ({filteredTasks.length})</h2>
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => onFilterChange(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          {userRole === 'Admin'
            ? 'No tasks created yet. Create your first task above!'
            : 'No tasks assigned to you yet.'}
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.taskId}
              task={task}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
