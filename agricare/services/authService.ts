import api from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for authentication
interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface UserInfo {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

// Authentication utility functions
const authService = {
  /**
   * Register a new user
   * @param email User's email
   * @param password User's password
   * @returns Promise with auth data
   */
  register: async (email: string, password: string) => {
    try {
      console.log(`Attempting to register user with email: ${email}`);
      console.log(`Using API base URL: ${api.defaults.baseURL}`);
      
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
      } as RegisterRequest);
      
      console.log('Registration successful, storing tokens');
      // Store the tokens
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      await AsyncStorage.setItem('token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        console.error('Request details:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error details:', error.message);
      }
      throw error;
    }
  },
  
  /**
   * Login an existing user
   * @param email User's email
   * @param password User's password
   * @returns Promise with auth data
   */
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      } as LoginRequest);
      
      // Store the tokens
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      await AsyncStorage.setItem('token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: async () => {
    try {
      // Clear all stored tokens
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'token_expiry']);
      
      // You can also make a logout request to your API if needed
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  /**
   * Check if a user is currently authenticated
   * @returns Boolean indicating if user is logged in
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const expiryString = await AsyncStorage.getItem('token_expiry');
      
      if (!token || !expiryString) {
        return false;
      }
      
      // Check if token is expired
      const expiry = parseInt(expiryString);
      if (Date.now() > expiry) {
        // Token is expired - could trigger refresh here
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  
  /**
   * Get the current authentication token
   * @returns The current token or null
   */
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },
  
  /**
   * Get the refresh token
   * @returns The refresh token or null
   */
  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Get refresh token error:', error);
      return null;
    }
  },
  
  /**
   * Refresh the access token using the refresh token
   * @returns The new auth response or null if refresh fails
   */
  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        return null;
      }
      
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken
      });
      
      // Store the new tokens
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      await AsyncStorage.setItem('token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout the user
      await authService.logout();
      return null;
    }
  },
  
  /**
   * Get the current user information
   * @returns User information or null if not authenticated
   */
  getUserInfo: async () => {
    try {
      // Check if we have an access token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        return null;
      }
      
      // Get user information from the API
      const response = await api.get<UserInfo>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  },
};

export default authService;
