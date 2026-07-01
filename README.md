# 🚀 Taskly –  Todo Application

> A modern full-stack Todo application built using **React.js** and **Node.js/Express.js** for efficient task management.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4-000000?style=flat&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

# 📌 Overview

Taskly is a full-stack task management application that enables users to create, organize, update, and manage daily tasks through a clean and responsive user interface backed by a RESTful Express.js API.

The project demonstrates full-stack web development concepts including CRUD operations, REST API integration, JSON-based persistence, React component architecture, and responsive UI design.

---

# ✨ Features

## 📝 Task Management

- Create new todos
- Edit existing todos
- Delete todos
- Update task status

## 🔍 Search & Filtering

- Search tasks instantly
- Filter by task status
- Filter by task priority
- Sort tasks by newest first

## 📊 Dashboard

- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks

## 🎨 User Interface

- Responsive design
- Modern dark theme
- Clean dashboard
- Easy navigation

---

# 📸 Pages

| Page | Description |
|------|-------------|
| Home | View and manage all tasks |
| Todo Details | View and edit individual todo |

---

# 🏗 Project Structure

```text
taskly-todo/
│
├── backend/
│   ├── src/
│   ├── data/
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── docs/
│   └── API.md
│
├── FEATURES.md
├── README.md
└── .gitignore
```

---

# 🛠 Technology Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Database

- JSON File Storage

## Tools

- Git
- GitHub
- npm

---

# 🔌 REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get todo by ID |
| POST | `/api/todos` | Create new todo |
| PATCH | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/keerthivasan01082004-arch/taskly-todo.git
```

Move into the project folder.

```bash
cd taskly-todo
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs at

```text
http://localhost:5000
```

---

## Frontend Setup

Open a second terminal.

```bash
cd frontend
npm install
npm start
```

Frontend runs at

```text
http://localhost:3000
```

> **Note:** Both backend and frontend must be running simultaneously.

---

# 📖 Documentation

Additional project documentation is available in:

- FEATURES.md
- docs/API.md

---

# 🔮 Future Enhancements

- User Authentication
- Cloud Database
- Due Date Notifications
- Task Categories
- Drag & Drop Tasks
- Team Collaboration

---

# 👨‍💻 Author

**Keerthi Vasan**

Integrated M.Tech – Computer Science and Engineering

VIT Vellore

GitHub: https://github.com/keerthivasan01082004-arch

---

# 📜 License

This project is developed for academic, learning, and portfolio purposes.
