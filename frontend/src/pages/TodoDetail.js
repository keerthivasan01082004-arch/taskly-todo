import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/todos';
import './TodoDetail.css';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in-progress', 'completed'];
const STATUS_LABELS = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TodoDetail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!id) { setError('No todo ID provided'); setLoading(false); return; }
    api.getTodo(id)
      .then((data) => { setTodo(data); setForm(toForm(data)); })
      .catch(() => setError('Todo not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const toForm = (t) => ({
    title: t.title,
    description: t.description || '',
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
    tags: [...(t.tags || [])],
    subtasks: (t.subtasks || []).map((s) => ({ ...s })),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateTodo(id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
        tags: form.tags,
        subtasks: form.subtasks,
      });
      setTodo(updated);
      setForm(toForm(updated));
      setEditing(false);
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    const updated = await api.toggleSubtask(id, subtaskId);
    setTodo(updated);
    setForm(toForm(updated));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm((f) => ({
      ...f,
      subtasks: [...f.subtasks, { id: Date.now().toString(), text: newSubtask.trim(), completed: false }],
    }));
    setNewSubtask('');
  };

  const removeSubtask = (idx) => {
    setForm((f) => ({ ...f, subtasks: f.subtasks.filter((_, i) => i !== idx) }));
  };

  const addTag = () => {
    const t = newTag.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setNewTag('');
  };

  const removeTag = (tag) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this todo permanently?')) return;
    await api.deleteTodo(id);
    navigate('/');
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString();
  };

  if (loading) return <div className="detail-page"><div className="loading-center"><div className="spinner" /></div></div>;
  if (error) return (
    <div className="detail-page">
      <div className="error-box">⚠️ {error} <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button></div>
    </div>
  );

  const isOverdue = todo.status !== 'completed' && todo.dueDate && new Date(todo.dueDate) < new Date();
  const subtasksDone = todo.subtasks?.filter((s) => s.completed).length || 0;
  const subtasksTotal = todo.subtasks?.length || 0;
  const progress = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : null;

  return (
    <div className="detail-page">
      {/* Top bar */}
      <div className="detail-topbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← All Todos</button>
        <div className="detail-actions">
          {editing ? (
            <>
              <button className="btn btn-ghost" onClick={() => { setEditing(false); setForm(toForm(todo)); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner" /> : null} Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(true)}>✏️ Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="detail-layout">
        {/* Main content */}
        <div className="detail-main">
          {editing ? (
            <input
              className="title-input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Todo title"
            />
          ) : (
            <h1 className={`detail-title ${todo.status === 'completed' ? 'done-title' : ''}`}>
              {todo.title}
            </h1>
          )}

          <div className="detail-badges">
            <span className={`badge badge-${todo.priority}`}>{PRIORITY_LABELS[todo.priority]}</span>
            <span className={`badge badge-${todo.status}`}>{STATUS_LABELS[todo.status]}</span>
            {isOverdue && <span className="overdue-badge">Overdue</span>}
          </div>

          {/* Description */}
          <section className="detail-section">
            <h3>Description</h3>
            {editing ? (
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={5}
                placeholder="Add a description..."
              />
            ) : (
              <p className="desc-text">{todo.description || <span className="no-content">No description</span>}</p>
            )}
          </section>

          {/* Subtasks */}
          <section className="detail-section">
            <h3>
              Subtasks
              {subtasksTotal > 0 && (
                <span className="section-count">{subtasksDone}/{subtasksTotal}</span>
              )}
            </h3>

            {progress !== null && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}

            <div className="subtasks-list">
              {(editing ? form.subtasks : todo.subtasks || []).map((s, i) => (
                <div key={s.id || i} className={`subtask-item ${s.completed ? 'subtask-done' : ''}`}>
                  <button
                    className={`subtask-check ${s.completed ? 'checked' : ''}`}
                    onClick={() => editing ? null : handleToggleSubtask(s.id)}
                    disabled={editing}
                  >
                    {s.completed ? '✓' : ''}
                  </button>
                  <span className="subtask-text">{s.text}</span>
                  {editing && (
                    <button className="subtask-remove" onClick={() => removeSubtask(i)}>×</button>
                  )}
                </div>
              ))}
              {(editing ? form.subtasks : todo.subtasks || []).length === 0 && (
                <p className="no-content">No subtasks</p>
              )}
            </div>

            {editing && (
              <div className="add-inline">
                <input
                  placeholder="Add subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                />
                <button className="btn btn-ghost btn-sm" onClick={addSubtask}>Add</button>
              </div>
            )}
          </section>

          {/* Tags */}
          <section className="detail-section">
            <h3>Tags</h3>
            <div className="tags-wrap">
              {(editing ? form.tags : todo.tags || []).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  {editing && <button className="tag-remove" onClick={() => removeTag(tag)}>×</button>}
                </span>
              ))}
              {(editing ? form.tags : todo.tags || []).length === 0 && (
                <span className="no-content">No tags</span>
              )}
            </div>
            {editing && (
              <div className="add-inline" style={{ marginTop: 10 }}>
                <input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <button className="btn btn-ghost btn-sm" onClick={addTag}>Add</button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h3>Details</h3>

            <div className="sidebar-field">
              <label>Status</label>
              {editing ? (
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              ) : (
                <span className={`badge badge-${todo.status}`}>{STATUS_LABELS[todo.status]}</span>
              )}
            </div>

            <div className="sidebar-field">
              <label>Priority</label>
              {editing ? (
                <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                </select>
              ) : (
                <span className={`badge badge-${todo.priority}`}>{PRIORITY_LABELS[todo.priority]}</span>
              )}
            </div>

            <div className="sidebar-field">
              <label>Due Date</label>
              {editing ? (
                <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              ) : (
                <span className={`due-val ${isOverdue ? 'overdue' : ''}`}>
                  {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '—'}
                  {isOverdue && ' ⚠️'}
                </span>
              )}
            </div>

            <div className="sidebar-field">
              <label>Created</label>
              <span className="meta-val">{formatDate(todo.createdAt)}</span>
            </div>

            <div className="sidebar-field">
              <label>Last Updated</label>
              <span className="meta-val">{formatDate(todo.updatedAt)}</span>
            </div>

            {todo.completedAt && (
              <div className="sidebar-field">
                <label>Completed At</label>
                <span className="meta-val" style={{ color: 'var(--success)' }}>{formatDate(todo.completedAt)}</span>
              </div>
            )}

            <div className="sidebar-field">
              <label>Todo ID</label>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all' }}>{todo.id}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
