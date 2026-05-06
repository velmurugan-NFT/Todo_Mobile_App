# 📝 Todo App – Full Stack

A full-stack mobile Todo application with user authentication, categories, and task management. Built with **React Native (Expo)** on the frontend and **Node.js + Express + PostgreSQL** on the backend.

---

## 📁 Project Structure

```
todo-app/
├── frontend/                        # React Native (Expo) mobile app
│   ├── App.js                       # App entry point (Redux Provider + Navigator)
│   ├── app.json                     # Expo app configuration
│   ├── babel.config.js              # Babel configuration
│   ├── package.json
│   ├── assets/                      # App icons and splash screen
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── TodoItem.js          # Single todo card component
│       │   ├── StatsCard.js         # Dashboard stats card
│       │   └── FilterChips.js       # Filter selector chips
│       ├── screens/                 # App screens
│       │   ├── LoginScreen.js
│       │   ├── RegisterScreen.js
│       │   ├── HomeScreen.js        # Todo list with filter/search
│       │   ├── CategoriesScreen.js  # Category management
│       │   ├── CreateTodoScreen.js  # Create / Edit todo (modal)
│       │   └── ProfileScreen.js     # User profile and settings
│       ├── navigation/
│       │   └── AppNavigator.js      # Stack + Tab navigation setup
│       ├── store/
│       │   ├── index.js             # Redux store configuration
│       │   └── slices/
│       │       ├── authSlice.js     # Auth state and async thunks
│       │       ├── todosSlice.js    # Todos state and async thunks
│       │       └── categoriesSlice.js
│       ├── services/
│       │   └── api.js               # Axios API service layer
│       └── utils/
│           └── theme.js             # Colors, fonts, spacing constants
│
└── backend/                         # Node.js REST API
    ├── package.json
    ├── .env.example                 # Environment variable template
    ├── migrations/
    │   └── run.js                   # Database migration script
    └── src/
        ├── server.js                # Express app setup and entry point
        ├── config/
        │   └── database.js          # PostgreSQL connection pool
        ├── middleware/
        │   ├── auth.js              # JWT authentication middleware
        │   └── errorHandler.js      # Global error handler
        ├── routes/
        │   ├── auth.js              # /api/auth routes
        │   ├── todos.js             # /api/todos routes
        │   └── categories.js        # /api/categories routes
        └── controllers/
            ├── authController.js    # Register, login, profile logic
            ├── todoController.js    # CRUD, toggle, stats logic
            └── categoryController.js
```

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- ✅ Create, edit, delete, and toggle todos as complete/incomplete
- 🗂️ Organize todos by custom categories (with color and icon)
- 🔢 Priority levels: Low, Medium, High
- 📅 Due dates and reminder support
- 🏷️ Tags support on todos
- 📊 Stats dashboard (total, completed, pending count)
- 🔍 Filter and search todos
- 👤 User profile update and password change
- 📱 Works on Android, iOS, and Web

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React Native 0.74 | Mobile UI framework |
| Expo ~51 | Build and development platform |
| Redux Toolkit | Global state management |
| React Navigation (Stack + Tabs) | Screen navigation |
| Axios | HTTP API requests |
| AsyncStorage | Local JWT token storage |
| React Hook Form | Form handling and validation |
| Expo Notifications | Push notification support |
| date-fns | Date formatting |
| React Native Reanimated | Animations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL + pg | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| Helmet | HTTP security headers |
| Morgan | Request logging |
| dotenv | Environment variable management |

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) v14 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- Expo Go app on your phone (for physical device testing)

---

## 🗄️ Database Setup

### 1. Create the PostgreSQL Database

```sql
CREATE DATABASE todo_app;
```

### 2. Run the Migration Script

The migration automatically creates all required tables and indexes.

```bash
cd backend
npm install
npm run migrate
```

### Tables Created

| Table | Description |
|---|---|
| `users` | Stores user accounts (id, name, email, password, avatar_url) |
| `categories` | User-defined categories with name, color, and icon |
| `todos` | Todo items with title, description, priority, due_date, tags, etc. |

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm run dev      # Development mode (auto-reload with nodemon)
npm start        # Production mode
```

- Server runs at: `http://localhost:5000`  
- Health check: `http://localhost:5000/health`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

| Command | Description |
|---|---|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator or device |
| `npm run ios` | Run on iOS simulator or device |
| `npm run web` | Run in the browser |

> **Note:** Update the API base URL in `src/services/api.js` to point to your backend server's IP address or domain.

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create a new account | ❌ |
| POST | `/login` | Login and receive JWT token | ❌ |
| GET | `/me` | Get current user info | ✅ |
| PUT | `/profile` | Update name or avatar | ✅ |
| PUT | `/change-password` | Change password | ✅ |

### Todos — `/api/todos`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all todos (with filters) | ✅ |
| GET | `/stats` | Get todo statistics | ✅ |
| GET | `/:id` | Get a single todo | ✅ |
| POST | `/` | Create a new todo | ✅ |
| PUT | `/:id` | Update a todo | ✅ |
| DELETE | `/:id` | Delete a todo | ✅ |
| PATCH | `/:id/toggle` | Toggle completed status | ✅ |

### Categories — `/api/categories`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all categories | ✅ |
| POST | `/` | Create a new category | ✅ |
| PUT | `/:id` | Update a category | ✅ |
| DELETE | `/:id` | Delete a category | ✅ |

---

## 🔐 Authentication Flow

1. User registers or logs in → receives a **JWT token** (valid 7 days)
2. Token is saved locally using **AsyncStorage**
3. Every API request sends the token in the header: `Authorization: Bearer <token>`
4. Backend **auth middleware** verifies the token and attaches the user to the request
5. On app launch, the `loadUser` thunk reads the saved token and restores the session automatically

---

## 🗺️ Navigation Structure

```
AppNavigator
├── Not Authenticated
│   ├── LoginScreen
│   └── RegisterScreen
│
└── Authenticated
    ├── TabNavigator (Bottom Tabs)
    │   ├── HomeScreen
    │   └── CategoriesScreen
    ├── CreateTodoScreen  (modal)
    ├── TodoDetail        (modal)
    └── ProfileScreen
```

---

## 📄 License

This project is private and for academic/learning purposes only.
