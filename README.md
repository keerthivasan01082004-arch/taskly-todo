# Taskly — Full-Stack Todo Application

A complete multi-page todo app built with **React** (frontend) and **Express.js** (backend), with JSON file-based persistence.

## Project Structure

```
todo-app/
├── backend/          # Express.js REST API
├── frontend/         # React multi-page app
└── docs/
    ├── API.md        # Full API reference
    └── FEATURES.md   # Feature list & documentation
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Start the Backend
```bash
cd backend
npm install
npm start          # runs on http://localhost:5000
# or
npm run dev        # with auto-reload via nodemon
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) — the frontend proxies API calls to port 5000.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | **Todo List** — view, filter, sort, create, delete todos |
| `/todo?id=<uuid>` | **Todo Detail** — full view and edit of a single todo |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, CSS custom properties |
| Backend | Node.js, Express.js 4 |
| Persistence | JSON file (`backend/src/data/todos.json`) |
| ID generation | `uuid` v4 |

---

## Documentation
- [Features & Functionality](./docs/FEATURES.md)
- [API Reference](./docs/API.md)
