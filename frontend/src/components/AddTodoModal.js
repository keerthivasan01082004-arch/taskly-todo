import { useState } from 'react';
import './Modal.css';

export default function AddTodoModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', tags: '', subtasks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      await onAdd({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        subtasks: form.subtasks ? form.subtasks.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Todo</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label>Title *</label>
            <input
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Tags <span className="label-hint">(comma separated)</span></label>
            <input placeholder="work, urgent, design" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Subtasks <span className="label-hint">(one per line)</span></label>
            <textarea
              placeholder={"Research competitors\nWrite draft\nReview & publish"}
              value={form.subtasks}
              onChange={(e) => set('subtasks', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            Create Todo
          </button>
        </div>
      </div>
    </div>
  );
}
