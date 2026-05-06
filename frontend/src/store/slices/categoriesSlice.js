import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesAPI } from '../../services/api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await categoriesAPI.getAll();
    return res.data.categories;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createCategory = createAsyncThunk('categories/create', async (data, { rejectWithValue }) => {
  try {
    const res = await categoriesAPI.create(data);
    return res.data.category;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await categoriesAPI.update(id, data);
    return res.data.category;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await categoriesAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(createCategory.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
