import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthResponse } from '../../types';
import { axiosInstance } from '../../lib/axios';

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  error: string | null;
}

const initialState: AuthState = {
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  error: null,
};

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<User>('/auth/check');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unauthorized');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<AuthResponse>(
        '/auth/register',
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/update-profile',
  async (data: { avatar_url: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed in update profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authUser = null;
      localStorage.removeItem('token');
      axiosInstance.post('/auth/logout');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, ...user } = action.payload;
        state.authUser = user;
        localStorage.setItem('token', token);
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        const { token, ...user } = action.payload;
        state.authUser = user;
        localStorage.setItem('token', token);
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isSigningUp = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
