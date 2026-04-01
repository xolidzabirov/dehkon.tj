import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../api';
import { userService } from '@/entities/user';
import type { User } from '@/entities/user';
import type { LoginRequest, RegisterRequest } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const errorTranslations: Record<string, string> = {
  'Invalid email or password': 'Неверный email или пароль',
  'User not found': 'Пользователь не найден',
  'Email already exists': 'Email уже зарегистрирован',
  'Username already exists': 'Имя пользователя уже занято',
  'Invalid credentials': 'Неверные учётные данные',
  'Account is deactivated': 'Аккаунт деактивирован',
  'Passwords do not match': 'Пароли не совпадают',
};

function translateError(message: string): string {
  return errorTranslations[message] || message;
}

function extractErrorMessage(error: any): string {
  if (!error.response?.data) {
    return error.message || 'Ошибка сети';
  }

  const data = error.response.data;

  if (typeof data === 'string') return translateError(data);

  if (data.error?.message) return translateError(data.error.message);

  if (data.errors) {
    const messages = Object.values(data.errors).flat() as string[];
    return messages.map(translateError).join('. ');
  }

  if (data.title) return translateError(data.title);

  return 'Произошла ошибка';
}

function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, '');
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const token = response.accessToken;
      localStorage.setItem('dehkon_token', token);
      document.cookie = `dehkon_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      const user = await userService.getMe();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const cleanedData = {
        ...data,
        phoneNumber: cleanPhone(data.phoneNumber),
      };
      await authService.register(cleanedData);
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      });
      const token = loginResponse.accessToken;
      localStorage.setItem('dehkon_token', token);
      document.cookie = `dehkon_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      const user = await userService.getMe();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getMe();
      return user;
    } catch (error: any) {
      localStorage.removeItem('dehkon_token');
      if (typeof document !== 'undefined') {
        document.cookie = 'dehkon_token=; path=/; max-age=0';
      }
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('dehkon_token') : null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dehkon_token');
        document.cookie = 'dehkon_token=; path=/; max-age=0';
      }
    },
    clearError(state) {
      state.error = null;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dehkon_token', action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
