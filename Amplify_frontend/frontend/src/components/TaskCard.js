import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`task-card ${task.status} priority-${task.priority}`}
      onClick={() => navigate(`/task/${task.taskId}`)}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
      </div>

      <div className="task-simple-meta">
        <div><strong>Status:</strong> {task.status}</div>
        {task.dueDate && (
          <div><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
        )}
      </div>

      <div className="click-indicator">
        ↵
      </div>
    </div>
  );
};

export default TaskCard;
