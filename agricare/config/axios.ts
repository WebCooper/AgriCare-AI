import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API configuration constant
const API_URL = 'http://192.168.1.101:8000'; // Replace with your actual API URL

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
// Store for pending requests that should be retried after token refresh
let pendingRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and the request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;
      
      // If not already refreshing, try to refresh the token
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Import would create circular dependency, use AsyncStorage directly
          const refreshToken = await AsyncStorage.getItem('refresh_token');
          
          if (!refreshToken) {
            // No refresh token - clear auth and reject
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'token_expiry']);
            return Promise.reject(error);
          }
          
          // Try to refresh the token
          const response = await axios.post(
            `${originalRequest.baseURL}/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          if (response.status === 200) {
            // Store the new tokens
            await AsyncStorage.setItem('access_token', response.data.access_token);
            await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
            await AsyncStorage.setItem('token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
            
            // Update the Authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
            
            // Process all pending requests with the new token
            pendingRequests.forEach(request => {
              request.resolve(api(request.config));
            });
            pendingRequests = [];
            
            // Retry the original request with the new token
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear auth and reject all pending requests
          pendingRequests.forEach(request => {
            request.reject(error);
          });
          pendingRequests = [];
          
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'token_expiry']);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If already refreshing, wait for it to complete before retrying
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve,
            reject,
            config: originalRequest
          });
        });
      }
    }
    
    // For errors other than 401, or if refresh failed
    return Promise.reject(error);
  }
);

export default api;
