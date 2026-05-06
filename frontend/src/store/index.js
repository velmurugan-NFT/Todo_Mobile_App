import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todosReducer from './slices/todosSlice';
import categoriesReducer from './slices/categoriesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } }),
});

export default store;
