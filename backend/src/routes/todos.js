const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readTodos, writeTodos } = require("../store");

const router = express.Router();

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["pending", "in-progress", "completed"];

// GET /api/todos — list all with optional filters
router.get("/", (req, res) => {
  let todos = readTodos();
  const { status, priority, search, sortBy, order } = req.query;

  if (status) todos = todos.filter((t) => t.status === status);
  if (priority) todos = todos.filter((t) => t.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  }

  const sortField = sortBy || "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;
  todos.sort((a, b) => {
    if (sortField === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
    }
    return a[sortField] > b[sortField] ? sortOrder : -sortOrder;
  });

  res.json({ todos, total: todos.length });
});

// GET /api/todos/:id — single todo
router.get("/:id", (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// POST /api/todos — create
router.post("/", (req, res) => {
  const { title, description, priority, dueDate, tags, subtasks } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority" });
  }

  const now = new Date().toISOString();
  const todo = {
    id: uuidv4(),
    title: title.trim(),
    description: description || "",
    status: "pending",
    priority: priority || "medium",
    dueDate: dueDate || null,
    tags: Array.isArray(tags) ? tags : [],
    subtasks: Array.isArray(subtasks)
      ? subtasks.map((s) => ({ id: uuidv4(), text: s, completed: false }))
      : [],
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };

  const todos = readTodos();
  todos.push(todo);
  writeTodos(todos);

  res.status(201).json(todo);
});

// PATCH /api/todos/:id — partial update
router.patch("/:id", (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Todo not found" });

  const { title, description, status, priority, dueDate, tags, subtasks } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority" });
  }

  const existing = todos[idx];
  const now = new Date().toISOString();

  const updated = {
    ...existing,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate }),
    ...(tags !== undefined && { tags }),
    ...(subtasks !== undefined && {
      subtasks: subtasks.map((s) =>
        typeof s === "string"
          ? { id: uuidv4(), text: s, completed: false }
          : s
      ),
    }),
    updatedAt: now,
    completedAt:
      status === "completed" && existing.status !== "completed"
        ? now
        : existing.completedAt,
  };

  todos[idx] = updated;
  writeTodos(todos);
  res.json(updated);
});

// PATCH /api/todos/:id/subtasks/:subtaskId — toggle subtask
router.patch("/:id/subtasks/:subtaskId", (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Todo not found" });

  const subIdx = todos[idx].subtasks.findIndex((s) => s.id === req.params.subtaskId);
  if (subIdx === -1) return res.status(404).json({ error: "Subtask not found" });

  todos[idx].subtasks[subIdx].completed = !todos[idx].subtasks[subIdx].completed;
  todos[idx].updatedAt = new Date().toISOString();
  writeTodos(todos);
  res.json(todos[idx]);
});

// DELETE /api/todos/:id — delete
router.delete("/:id", (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Todo not found" });

  todos.splice(idx, 1);
  writeTodos(todos);
  res.json({ message: "Todo deleted successfully" });
});

// DELETE /api/todos — bulk delete completed
router.delete("/", (req, res) => {
  const { clearCompleted } = req.query;
  if (clearCompleted !== "true") {
    return res.status(400).json({ error: "Use ?clearCompleted=true" });
  }
  let todos = readTodos();
  const before = todos.length;
  todos = todos.filter((t) => t.status !== "completed");
  writeTodos(todos);
  res.json({ message: `Deleted ${before - todos.length} completed todos` });
});

module.exports = router;
