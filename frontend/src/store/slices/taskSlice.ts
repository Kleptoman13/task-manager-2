import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Task } from '../../types';
import { axiosInstance } from '../../lib/axios';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<Task[]>('/tasks');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  '/tasks/create',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/tasks', taskData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  '/tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  '/tasks/update',
  async (
    { id, data }: { id: string; data: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
