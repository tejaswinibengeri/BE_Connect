# Task Manager (React + Node.js + MongoDB)

Full‑stack task manager web app with:

- **Auth**: signup + login (JWT)
- **Tasks**: add, edit, delete (per-user)

This repo already contains a legacy Django backend (`backend/`). For this task manager, the Node.js backend lives in `server/` and the React app lives in `frontend/`.

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

### 1) Backend (Node.js + Express)

Create `server/.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=change_me
PORT=5000
CLIENT_ORIGIN=http://localhost:5194
```

Install and run:

```bash
cd server
npm install
npm run dev
```

API runs on `http://localhost:5000`.

### 2) Frontend (React)

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5194`.

## Features

- Signup / Login
- Task list (only your tasks)
- Add task
- Edit task
- Delete task
