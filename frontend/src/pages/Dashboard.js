import { useEffect, useState } from "react";
import API from "../api";
import useGlassHover from "../hooks/useGlassHover";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isExtracting, setIsExtracting] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  useGlassHover([tasks, deleteTarget]);

  const formatTimestamp = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const pushToast = (message, tone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const getSortedFilteredTasks = () => {
    const filtered = tasks.filter((task) => {
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "open" && !task.completed);

      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });

    return filtered.sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
        return bTime - aTime;
      }

      return b.id - a.id;
    });
  };

  const extract = async () => {
    if (isExtracting) return;
    setIsExtracting(true);
    await API.post("/extract", { text });
    setText("");
    await fetchTasks();
    pushToast("Tasks extracted successfully");
    setIsExtracting(false);
  };

  const complete = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: "complete" }));
    await API.put(`/tasks/${id}/complete`);
    await fetchTasks();
    pushToast("Task marked complete");
    setActionLoading((prev) => ({ ...prev, [id]: null }));
  };

  const reopen = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: "reopen" }));
    await API.put(`/tasks/${id}/undo`);
    await fetchTasks();
    pushToast("Task reopened");
    setActionLoading((prev) => ({ ...prev, [id]: null }));
  };

  const remove = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
    await API.delete(`/tasks/${id}`);
    await fetchTasks();
    pushToast("Task deleted");
    setActionLoading((prev) => ({ ...prev, [id]: null }));
  };

  const startEdit = (task) => {
    setEditing(task.id);
    setEditData(task);
  };

  const saveEdit = async (id) => {
    if (savingId) return;
    setSavingId(id);
    await API.put(`/tasks/${id}`, editData);
    setEditing(null);
    await fetchTasks();
    pushToast("Task updated");
    setSavingId(null);
  };

  const openDeleteModal = (task) => {
    setDeleteTarget(task);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="toast-stack">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card ${toast.tone}`}>
            <div className="toast-dot" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <nav className="navbar navbar-expand-lg dashboard-nav">
        <div className="container">
          <div className="nav-brand">
            <span className="brand-mark" />
            <div>
              <span className="navbar-brand">TaskScribe</span>
              <span className="nav-subtitle">Dashboard</span>
            </div>
          </div>

          <div className="nav-actions">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-shell">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Your Workspace</h1>
              <p className="text-muted">
                Capture decisions, track ownership, and keep momentum.
              </p>
            </div>
          </div>

          {/* Extract Section */}
          <div className="glass-card glass-hover p-4 mb-4">
            <div className="section-title">
              <h5>Paste Meeting Transcript</h5>
              <span>Auto-detect action items in seconds.</span>
            </div>

            <textarea
              className="form-control mb-3"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the meeting notes or transcript here..."
            />

            <button className="btn btn-primary" onClick={extract} disabled={isExtracting}>
              {isExtracting && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {isExtracting ? "Extracting" : "Extract Tasks"}
            </button>
          </div>

          <div className="task-toolbar">
            <div>
              <h5>Your Tasks</h5>
              <div className="mb-3">
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => {
                    if (window.confirm("Delete ALL tasks?")) {
                        await API.delete("/tasks/all");
                        fetchTasks();
                    }
                    }}
                >
                    Delete All Tasks
                </button>
                </div>

              <p className="text-muted mb-0">Newest tasks appear first.</p>
            </div>

            <div className="task-filters glass-card glass-hover p-3">
              <div className="filter-group">
                <span className="filter-label">Status</span>
                <div className="btn-group" role="group" aria-label="Status filter">
                  <button
                    className={`btn btn-sm ${
                      statusFilter === "all" ? "btn-primary" : "btn-outline-light"
                    }`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`btn btn-sm ${
                      statusFilter === "open" ? "btn-primary" : "btn-outline-light"
                    }`}
                    onClick={() => setStatusFilter("open")}
                  >
                    Open
                  </button>
                  <button
                    className={`btn btn-sm ${
                      statusFilter === "completed"
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="priorityFilter">
                  Priority
                </label>
                <select
                  id="priorityFilter"
                  className="form-control form-control-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

        {getSortedFilteredTasks().length === 0 ? (
          <div className="empty-state glass-card glass-hover">
            <div className="empty-icon">📄</div>
            <h4>No tasks yet</h4>
            <p>Paste a meeting transcript to generate tasks.</p>
          </div>
        ) : (
          getSortedFilteredTasks().map((t) => (
            <div className="glass-card glass-hover task-card p-3 mb-3" key={t.id}>
              {editing === t.id ? (
              <>
                <input
                  className="form-control mb-2"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Owner"
                  value={editData.owner || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, owner: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Deadline"
                  value={editData.deadline || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, deadline: e.target.value })
                  }
                />

                <select
                  className="form-control mb-2"
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => saveEdit(t.id)}
                  disabled={savingId === t.id}
                >
                  {savingId === t.id && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {savingId === t.id ? "Saving" : "Save"}
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="task-header">
                  <div className="task-title">{t.description}</div>
                  <span className={`status-pill ${t.completed ? "done" : "open"}`}>
                    {t.completed ? "Completed" : "Open"}
                  </span>
                </div>

                <div className="task-meta mt-2">
                  <span>
                    Owner: <b>{t.owner || "—"}</b>
                  </span>
                  <span>
                    Deadline: <b>{t.deadline || "—"}</b>
                  </span>
                  <span>
                    Priority: <b>{t.priority}</b>
                  </span>
                  <span>
                    Created: <b>{formatTimestamp(t.created_at)}</b>
                  </span>
                </div>

                {/* BUTTON ROW — NEVER CHANGES POSITION */}
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {t.completed ? (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => reopen(t.id)}
                      disabled={actionLoading[t.id]}
                    >
                      {actionLoading[t.id] === "reopen" && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      {actionLoading[t.id] === "reopen" ? "Reopening" : "Reopen"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => complete(t.id)}
                      disabled={actionLoading[t.id]}
                    >
                      {actionLoading[t.id] === "complete" && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      {actionLoading[t.id] === "complete" ? "Completing" : "Complete"}
                    </button>
                  )}

                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => startEdit(t)}
                    disabled={actionLoading[t.id]}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => openDeleteModal(t)}
                    disabled={actionLoading[t.id]}
                  >
                    {actionLoading[t.id] === "delete" && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {actionLoading[t.id] === "delete" ? "Deleting" : "Delete"}
                  </button>
                </div>
              </>
            )}
            </div>
          ))
        )}
        </div>
      </div>

      {deleteTarget && (
        <>
          <div className="modal show modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content glass-card glass-hover">
                <div className="modal-header">
                  <h5 className="modal-title">Delete task</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={closeDeleteModal}
                  />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this task?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={confirmDelete}
                    disabled={actionLoading[deleteTarget.id]}
                  >
                    {actionLoading[deleteTarget.id] === "delete" && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {actionLoading[deleteTarget.id] === "delete" ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}
