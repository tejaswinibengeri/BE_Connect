# BE Connect - Engineering Student Collaboration Platform

Welcome to the full-stack BE Connect hackathon MVP built with React (Frontend) and Django REST Framework (Backend). 

## 🚀 Tech Stack Highlights

- **Frontend**: React.js with Vite, React Router, Axios, and styled using modern, premium custom CSS (Glassmorphism & Gradients) featuring `lucide-react` icons.
- **Backend**: Python with Django and Django REST Framework.
- **Database**: SQLite3 by default (to ensure instant plug & play without database setup during hackathon). *Easily switchable to MySQL in `backend/core/settings.py`.*
- **Authentication**: JWT setup via `djangorestframework-simplejwt`. 

## ⚙️ How to Run

### 1. Run the Backend

Open a terminal and:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt # (If generated) or just run the following commands!
python manage.py runserver 0.0.0.0:8000
```
*Note: Make sure to clear migrations or run `python manage.py makemigrations` and `python manage.py migrate` if required.*

### 2. Run the Frontend

Open another terminal and:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`. 

## 🌟 Modules Implemented

1. **Authentication System (JWT)**: Login and register flow mapped directly to a heavily customized User model.
2. **Student Dashboard**: Visually rich overview displaying key collaboration stats.
3. **Project Collaboration**: Find teammates by posting requirements.
4. **Discussion Forum**: Threaded questions & answers section for peers.
5. **Resources Sharing**: Cloud-integrated upload section (using external URLs to preserve fast hackathon MVP dynamics).
6. **Hackathons**: Discover and post upcoming technical hackathon opportunities.
7. **Profile View**: View and update your branch, skills, bio, and GitHub links.

> *Good luck with the Hackathon presentation! The UI rules are strictly adhered to, keeping the frontend dynamic, responsive, and stunning without complex CSS framework dependencies.*
