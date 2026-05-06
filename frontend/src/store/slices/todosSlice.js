import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todosAPI } from '../../services/api';

export const fetchTodos = createAsyncThunk('todos/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await todosAPI.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchStats = createAsyncThunk('todos/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await todosAPI.getStats();
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createTodo = createAsyncThunk('todos/create', async (data, { rejectWithValue }) => {
  try {
    const res = await todosAPI.create(data);
    return res.data.todo;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateTodo = createAsyncThunk('todos/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await todosAPI.update(id, data);
    return res.data.todo;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id, { rejectWithValue }) => {
  try {
    await todosAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleTodo = createAsyncThunk('todos/toggle', async (id, { rejectWithValue }) => {
  try {
    const res = await todosAPI.toggle(id);
    return res.data.todo;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    pagination: null,
    stats: null,
    loading: false,
    error: null,
    filter: { status: 'all', priority: null, category_id: null, search: '' },
  },
  reducers: {
    setFilter: (state, action) => { state.filter = { ...state.filter, ...action.payload }; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.todos;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTodos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; })

      .addCase(createTodo.fulfilled, (state, action) => { state.items.unshift(action.payload); })

      .addCase(updateTodo.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })

      .addCase(toggleTodo.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setFilter, clearError } = todosSlice.actions;
export default todosSlice.reducer;
