const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
};

export const api = {
  getTodos: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/todos${q ? "?" + q : ""}`).then(handle);
  },
  getTodo: (id) => fetch(`${BASE}/todos/${id}`).then(handle),
  createTodo: (data) =>
    fetch(`${BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),
  updateTodo: (id, data) =>
    fetch(`${BASE}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),
  toggleSubtask: (todoId, subtaskId) =>
    fetch(`${BASE}/todos/${todoId}/subtasks/${subtaskId}`, {
      method: "PATCH",
    }).then(handle),
  deleteTodo: (id) =>
    fetch(`${BASE}/todos/${id}`, { method: "DELETE" }).then(handle),
  clearCompleted: () =>
    fetch(`${BASE}/todos?clearCompleted=true`, { method: "DELETE" }).then(handle),
};
