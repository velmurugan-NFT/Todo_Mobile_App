# 📝 Todo App — Full Stack

A full-featured Todo mobile application built with:
- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

---

## 📁 Project Structure

```
todo-app/
├── backend/             # Node.js REST API
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, error handling
│   │   └── routes/      # API routes
│   ├── migrations/      # DB schema
│   └── package.json
│
└── frontend/            # React Native (Expo)
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── navigation/  # React Navigation setup
    │   ├── screens/     # App screens
    │   ├── services/    # API service layer
    │   ├── store/       # Redux state management
    │   └── utils/       # Theme, helpers
    ├── App.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or Expo Go app

---

## 🗄️ Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE todo_app;
```

2. Run migrations:
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials
npm install
npm run migrate
```

---

## 🖥️ Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your values in .env

npm install
npm run dev       # Development
npm start         # Production
```

Backend runs at: `http://localhost:5000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| GET | /api/todos | List todos (with filters) |
| POST | /api/todos | Create todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |
| PATCH | /api/todos/:id/toggle | Toggle complete |
| GET | /api/todos/stats | Get statistics |
| GET | /api/categories | List categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

---

## 📱 Frontend Setup

```bash
cd frontend
npm install

# Update API URL in src/services/api.js:
# const BASE_URL = 'http://YOUR_IP:5000/api';

npx expo start
```

Then scan the QR code with Expo Go, or press:
- `i` for iOS simulator
- `a` for Android emulator

---

## ✨ Features

- 🔐 JWT Authentication (register, login, profile)
- ✅ Full CRUD for Todos
- 🏷️ Categories with colors & icons
- 🎯 Priority levels (High / Medium / Low)
- 🔍 Search & filter todos
- 📊 Dashboard statistics
- 📅 Due dates & reminders
- 🏷️ Tags on todos
- 🌙 Dark theme throughout
- 📱 Responsive mobile UI

---

## 🛠️ Tech Stack

### Backend
- Express.js — web framework
- pg — PostgreSQL client
- bcryptjs — password hashing
- jsonwebtoken — authentication
- helmet — security headers
- morgan — request logging

### Frontend
- React Native + Expo
- Redux Toolkit — state management
- React Navigation — routing
- Axios — HTTP client
- Expo Linear Gradient — UI effects
- date-fns — date utilities
