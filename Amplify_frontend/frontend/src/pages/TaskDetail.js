import { useNavigate, useParams } from 'react-router-dom';

const TaskDetail = ({ tasks, userRole, updateTaskStatus, deleteTask, loading }) => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const task = tasks.find(t => t.taskId === taskId);

  if (!task) {
    return (
      <div className="task-detail-page">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Task not found</h1>
      </div>
    );
  }

  const handleStatusChange = async (status) => {
    await updateTaskStatus(taskId, status);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="task-detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className={`task-detail-card priority-${task.priority}`}>
        <div className="task-detail-header">
          <div>
            <h1>{task.title}</h1>
            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          </div>
          {userRole === 'admin' && (
            <div className="detail-actions">
              <button
                onClick={() => navigate(`/edit-task/${task.taskId}`)}
                className="edit-btn"
                disabled={loading}
              >
                Edit Task
              </button>
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={loading}
              >
                Delete Task
              </button>
            </div>
          )}
        </div>

        <div className="task-detail-section">
          <h3>Description</h3>
          <p>{task.description}</p>
        </div>

        <div className="task-detail-section">
          <h3>Assigned To</h3>
          <div className="assignees-list">
            {task.assignedMembers?.map((email, idx) => (
              <span key={idx} className="assigned-member">{email}</span>
            ))}
          </div>
        </div>

        <div className="task-detail-grid">
          <div className="task-detail-item">
            <strong>Status</strong>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loading}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
              {userRole === 'admin' && <option value="cancelled">Cancelled</option>}
            </select>
          </div>

          <div className="task-detail-item">
            <strong>Created By</strong>
            <span>{task.createdBy}</span>
          </div>

          <div className="task-detail-item">
            <strong>Created On</strong>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          {task.dueDate && (
            <div className="task-detail-item">
              <strong>Due Date</strong>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
