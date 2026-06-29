# API Reference

Base URL: `http://localhost:5000/api`

All request and response bodies are JSON. All timestamps are ISO 8601.

---

## Endpoints

### `GET /todos`
List todos with optional filtering and sorting.

**Query parameters:**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `pending`, `in-progress`, `completed` | Filter by status |
| `priority` | `low`, `medium`, `high` | Filter by priority |
| `search` | string | Search title, description, and tags |
| `sortBy` | `createdAt`, `updatedAt`, `dueDate`, `priority` | Sort field (default: `createdAt`) |
| `order` | `asc`, `desc` | Sort direction (default: `desc`) |

**Response:**
```json
{
  "todos": [ ...todo objects ],
  "total": 5
}
```

---

### `GET /todos/:id`
Get a single todo by UUID.

**Response:** Todo object or `404 { "error": "Todo not found" }`

---

### `POST /todos`
Create a new todo.

**Request body:**
```json
{
  "title": "Finish report",
  "description": "Optional longer text",
  "priority": "high",
  "dueDate": "2025-12-31",
  "tags": ["work", "urgent"],
  "subtasks": ["Gather data", "Write draft"]
}
```

| Field | Required | Default |
|-------|----------|---------|
| `title` | ✅ | — |
| `description` | ❌ | `""` |
| `priority` | ❌ | `"medium"` |
| `dueDate` | ❌ | `null` |
| `tags` | ❌ | `[]` |
| `subtasks` | ❌ | `[]` |

**Response:** `201` with created todo object.

---

### `PATCH /todos/:id`
Partially update a todo. Only send fields you want to change.

**Request body (all optional):**
```json
{
  "title": "New title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2025-11-01",
  "tags": ["personal"],
  "subtasks": [
    { "id": "existing-uuid", "text": "Step one", "completed": true },
    { "id": "another-uuid", "text": "Step two", "completed": false }
  ]
}
```

**Response:** Updated todo object.

---

### `PATCH /todos/:id/subtasks/:subtaskId`
Toggle a single subtask's `completed` state (no body needed).

**Response:** Updated parent todo object.

---

### `DELETE /todos/:id`
Delete a todo permanently.

**Response:**
```json
{ "message": "Todo deleted successfully" }
```

---

### `DELETE /todos?clearCompleted=true`
Bulk delete all todos with status `completed`.

**Response:**
```json
{ "message": "Deleted 3 completed todos" }
```

---

## Error Responses

| Status | Body | Meaning |
|--------|------|---------|
| 400 | `{ "error": "Title is required" }` | Validation failed |
| 404 | `{ "error": "Todo not found" }` | ID not found |
| 500 | `{ "error": "Internal server error" }` | Unexpected server error |

---

## Data Storage

Todos are persisted to `backend/src/data/todos.json`. The file is created automatically on first write. Each entry is a full todo object. The file is read and written synchronously using Node's `fs` module.
