# Features & Functionality

## Todo List Page (`/`)

### Stats Dashboard
Four stat cards at the top show live counts:
- **Total** — all todos in the system
- **Pending** — not yet started
- **In Progress** — actively being worked on
- **Done** — completed todos

### Creating Todos
- Click **+ New Todo** to open the creation modal
- **Required:** Title
- **Optional:** Description, Priority (Low/Medium/High), Due Date, Tags (comma-separated), Subtasks (one per line)
- Press Enter in the title field to submit quickly

### Viewing Todos
- Todos are displayed as cards in a responsive grid
- Card left border color indicates priority: blue = low, orange = medium, red = high
- Cards show title, short description preview, priority badge, status badge, due date, subtask progress, and first 2 tags

### Filtering
- **Search:** Full-text search across title, description, and tags — live filtering
- **Status filter:** Filter by Pending / In Progress / Completed
- **Priority filter:** Filter by High / Medium / Low

### Sorting
- Newest First (default)
- Oldest First
- Due Soon (soonest due date first)
- Priority (high → medium → low)

### Quick Status Cycling
- Click the circle icon on any card to cycle its status: Pending → In Progress → Completed → Pending
- No need to open the detail page for a quick update

### Overdue Indicator
- Todos past their due date that are not completed show an animated **Overdue** badge

### Deleting Todos
- Click the `×` button (appears on hover) on any card to delete with confirmation
- **Clear Done** button appears when there are completed todos — bulk-deletes all completed

### Navigation
- Click anywhere on a card body to navigate to the Todo Detail page

---

## Todo Detail Page (`/todo?id=<uuid>`)

Accessed via URL with the todo's UUID as a query parameter: `/todo?id=<todo-id>`

### Viewing a Todo
Full detail view shows:
- Title with strikethrough if completed
- Priority and status badges; overdue warning
- Full description
- Subtask list with individual completion checkboxes and an overall progress bar
- Tags list
- Sidebar: status, priority, due date, created timestamp, last updated timestamp, completed timestamp, and the todo's UUID

### Editing a Todo
Click **✏️ Edit** to enter edit mode. All fields become editable in-place:
- Title (text input)
- Description (textarea)
- Priority (dropdown)
- Status (dropdown)
- Due date (date picker)
- Tags — add via input + Enter or the Add button; remove with the × on each tag
- Subtasks — add new subtasks inline; remove existing ones with ×

Click **Save Changes** to persist, or **Cancel** to discard.

### Toggling Subtasks
In view mode (not editing), click any subtask's circle to mark it complete or incomplete. Changes are saved immediately to the backend.

### Deleting
Click **🗑 Delete** and confirm to permanently delete the todo and return to the list.

---

## Data Model

Each todo object contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `title` | string | Required; the todo name |
| `description` | string | Optional longer description |
| `status` | enum | `pending`, `in-progress`, `completed` |
| `priority` | enum | `low`, `medium`, `high` |
| `dueDate` | ISO date string or null | Optional deadline |
| `tags` | string[] | Array of tag strings |
| `subtasks` | object[] | `{ id, text, completed }` |
| `createdAt` | ISO datetime | Auto-set on creation |
| `updatedAt` | ISO datetime | Auto-updated on every change |
| `completedAt` | ISO datetime or null | Set when status → completed |

---

## Design Notes

- Dark-first UI using CSS custom properties for consistent theming
- Priority visually encoded via card border color (not just badge text)
- Overdue todos pulse with a CSS animation to draw attention
- All API calls are centralized in `frontend/src/api/todos.js` for easy swapping
- The backend validates required fields and enum values; errors are returned as `{ error: "..." }` JSON
