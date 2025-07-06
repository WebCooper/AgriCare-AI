import axios from 'axios';
import { API_URL } from '@env';
// Use a more generic storage approach
import * as SecureStore from 'expo-secure-store';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Define endpoints
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
};

// Storage helper functions
const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error accessing secure storage:', error);
    return null;
  }
};

const setToken = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error storing in secure storage:', error);
  }
};

const removeToken = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error removing from secure storage:', error);
  }
};

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await getToken('access_token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = await getToken('refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          // You might want to implement navigation to login screen here
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}${ENDPOINTS.AUTH.REFRESH}`, {
          refresh_token: refreshToken,
        });
        
        // Store new tokens
        await setToken('access_token', response.data.access_token);
        await setToken('refresh_token', response.data.refresh_token);
        
        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await removeToken('access_token');
        await removeToken('refresh_token');
        
        // You might want to implement navigation to login screen here
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication helper functions
export const auth = {
  // Register a new user
  register: async (email: string, password: string, userType: string) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      user_type: userType
    });
    return response.data;
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    
    // Store tokens
    if (response.data.access_token) {
      await setToken('access_token', response.data.access_token);
    }
    
    if (response.data.refresh_token) {
      await setToken('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    const refreshToken = await getToken('refresh_token');
    if (refreshToken) {
      try {
        await api.post(ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear tokens regardless of API success
    await removeToken('access_token');
    await removeToken('refresh_token');
  },

  // Check if user is logged in
  isAuthenticated: async () => {
    const token = await getToken('access_token');
    return !!token;
  },
  
  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data;
  }
};

export default api;