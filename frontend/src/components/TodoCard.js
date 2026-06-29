import { useNavigate } from 'react-router-dom';
import './TodoCard.css';

const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };
const statusLabel = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Done' };

export default function TodoCard({ todo, onDelete, onStatusChange }) {
  const navigate = useNavigate();

  const isOverdue =
    todo.status !== 'completed' &&
    todo.dueDate &&
    new Date(todo.dueDate) < new Date();

  const subtasksDone = todo.subtasks?.filter((s) => s.completed).length || 0;
  const subtasksTotal = todo.subtasks?.length || 0;

  return (
    <div
      className={`todo-card priority-${todo.priority} ${todo.status === 'completed' ? 'done' : ''}`}
      onClick={() => navigate(`/todo?id=${todo.id}`)}
    >
      <div className="card-header">
        <button
          className={`status-toggle status-${todo.status}`}
          title="Cycle status"
          onClick={(e) => {
            e.stopPropagation();
            const next = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
            onStatusChange(todo.id, next[todo.status]);
          }}
        >
          {todo.status === 'completed' ? '✓' : todo.status === 'in-progress' ? '◐' : '○'}
        </button>
        <span className="card-title">{todo.title}</span>
        <button
          className="card-delete"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
        >
          ×
        </button>
      </div>

      {todo.description && (
        <p className="card-desc">{todo.description.slice(0, 90)}{todo.description.length > 90 ? '…' : ''}</p>
      )}

      <div className="card-meta">
        <span className={`badge badge-${todo.priority}`}>{priorityLabel[todo.priority]}</span>
        <span className={`badge badge-${todo.status}`}>{statusLabel[todo.status]}</span>
        {isOverdue && <span className="overdue-badge">Overdue</span>}
      </div>

      <div className="card-footer">
        {todo.dueDate && (
          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            📅 {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
        {subtasksTotal > 0 && (
          <span className="subtask-count">
            ▣ {subtasksDone}/{subtasksTotal}
          </span>
        )}
        {todo.tags?.length > 0 && (
          <div className="card-tags">
            {todo.tags.slice(0, 2).map((t) => <span key={t} className="tag">{t}</span>)}
            {todo.tags.length > 2 && <span className="tag">+{todo.tags.length - 2}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
