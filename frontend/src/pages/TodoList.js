import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/todos';
import TodoCard from '../components/TodoCard';
import AddTodoModal from '../components/AddTodoModal';
import './TodoList.css';

const STATS_LABELS = {
  total: 'Total', pending: 'Pending', 'in-progress': 'In Progress', completed: 'Done'
};

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sortBy: 'createdAt', order: 'desc' });
  const [stats, setStats] = useState({ total: 0, pending: 0, 'in-progress': 0, completed: 0 });

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      params.sortBy = filters.sortBy;
      params.order = filters.order;

      const data = await api.getTodos(params);
      setTodos(data.todos);

      // Compute stats from all todos (no filters)
      const all = await api.getTodos({});
      const s = { total: all.total, pending: 0, 'in-progress': 0, completed: 0 };
      all.todos.forEach((t) => { if (s[t.status] !== undefined) s[t.status]++; });
      setStats(s);
    } catch (e) {
      setError('Failed to load todos. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  const handleAdd = async (data) => {
    await api.createTodo(data);
    await loadTodos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    await api.deleteTodo(id);
    await loadTodos();
  };

  const handleStatusChange = async (id, status) => {
    await api.updateTodo(id, { status });
    await loadTodos();
  };

  const handleClearCompleted = async () => {
    if (!window.confirm('Delete all completed todos?')) return;
    await api.clearCompleted();
    await loadTodos();
  };

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="list-page">
      {/* Stats Bar */}
      <div className="stats-bar">
        {Object.entries(STATS_LABELS).map(([key, label]) => (
          <div key={key} className={`stat-item stat-${key}`}>
            <span className="stat-count">{stats[key]}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search todos..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
          {filters.search && (
            <button className="clear-search" onClick={() => setFilter('search', '')}>×</button>
          )}
        </div>

        <div className="toolbar-right">
          <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={`${filters.sortBy}-${filters.order}`} onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            setFilters((f) => ({ ...f, sortBy: s, order: o }));
          }}>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Soon</option>
            <option value="priority-desc">Priority</option>
          </select>

          {stats.completed > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={handleClearCompleted}>
              🗑 Clear Done
            </button>
          )}

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Todo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="list-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="error-box">
            <span>⚠️</span> {error}
            <button className="btn btn-ghost btn-sm" onClick={loadTodos}>Retry</button>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>{filters.search || filters.status || filters.priority
              ? 'No todos match your filters.'
              : 'No todos yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="todo-grid">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && <AddTodoModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
