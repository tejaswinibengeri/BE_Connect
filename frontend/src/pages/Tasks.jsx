import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { Check, Plus, Save, Trash2, X } from 'lucide-react';

function formatDateInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDue, setNewDue] = useState('');

  const [editing, setEditing] = useState(null); // {id, title, description, dueDate, completed}
  const [savingEdit, setSavingEdit] = useState(false);

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  async function refresh() {
    const res = await api.get('tasks');
    setTasks(res.data.tasks);
  }

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await api.post('tasks', {
        title: newTitle.trim(),
        description: newDescription.trim(),
        dueDate: newDue ? new Date(`${newDue}T00:00:00.000Z`).toISOString() : undefined,
      });
      setNewTitle('');
      setNewDescription('');
      setNewDue('');
      await refresh();
    } finally {
      setCreating(false);
    }
  };

  const toggleComplete = async (t) => {
    const optimistic = tasks.map((x) => (x.id === t.id ? { ...x, completed: !x.completed } : x));
    setTasks(optimistic);
    try {
      await api.put(`tasks/${t.id}`, { completed: !t.completed });
    } catch {
      await refresh();
    }
  };

  const startEdit = (t) => {
    setEditing({
      id: t.id,
      title: t.title,
      description: t.description ?? '',
      completed: !!t.completed,
      dueDate: t.dueDate,
    });
  };

  const saveEdit = async () => {
    if (!editing?.title?.trim()) return;
    setSavingEdit(true);
    try {
      await api.put(`tasks/${editing.id}`, {
        title: editing.title.trim(),
        description: (editing.description ?? '').trim(),
        dueDate: editing.dueDate ? editing.dueDate : null,
        completed: editing.completed,
      });
      setEditing(null);
      await refresh();
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteTask = async (t) => {
    const ok = window.confirm('Delete this task?');
    if (!ok) return;
    const prev = tasks;
    setTasks(tasks.filter((x) => x.id !== t.id));
    try {
      await api.delete(`tasks/${t.id}`);
    } catch {
      setTasks(prev);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 className="text-gradient" style={{ marginBottom: '0.25rem' }}>My Tasks</h2>
            <div style={{ color: 'var(--text-muted)' }}>
              {user?.name ? `Hi, ${user.name}` : user?.email ? user.email : 'Signed in'} · {completedCount}/{tasks.length} completed
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Finish the report" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Description (optional)</label>
              <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Add details…" rows={3} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Due date (optional)</label>
                <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button type="submit" className="btn-primary" disabled={creating} style={{ justifyContent: 'center', minWidth: 140 }}>
                  <Plus size={18} /> {creating ? 'Adding…' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading…</div>
        ) : tasks.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No tasks yet. Add your first task above.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.9rem 0.9rem',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                  <button
                    onClick={() => toggleComplete(t)}
                    className="btn-primary"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      justifyContent: 'center',
                      borderRadius: 12,
                      opacity: t.completed ? 0.9 : 0.6,
                    }}
                    title={t.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <Check size={18} />
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
                      {t.dueDate ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          Due {formatDateInput(t.dueDate)}
                        </span>
                      ) : null}
                    </div>
                    {t.description ? (
                      <div style={{ marginTop: 6, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{t.description}</div>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" type="button" onClick={() => startEdit(t)}>Edit</button>
                  <button className="btn-secondary" type="button" onClick={() => deleteTask(t)} style={{ color: 'var(--danger)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 50,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="glass-card" style={{ width: 560, maxWidth: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ margin: 0 }}>Edit task</h3>
              <button className="btn-secondary" type="button" onClick={() => setEditing(null)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Title</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'end' }}>
                <div style={{ flex: '1 1 220px' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Due date</label>
                  <input
                    type="date"
                    value={formatDateInput(editing.dueDate)}
                    onChange={(e) => {
                      const next = e.target.value
                        ? new Date(`${e.target.value}T00:00:00.000Z`).toISOString()
                        : null;
                      setEditing({ ...editing, dueDate: next });
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                  <button className="btn-secondary" type="button" onClick={() => setEditing(null)} disabled={savingEdit}>
                    Cancel
                  </button>
                  <button className="btn-primary" type="button" onClick={saveEdit} disabled={savingEdit} style={{ justifyContent: 'center', minWidth: 140 }}>
                    <Save size={18} /> {savingEdit ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

