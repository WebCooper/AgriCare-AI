# AgriCare AI Authentication Guide

This guide explains how to use the authentication system in your mobile app.

## Overview

The authentication system uses JWT tokens with refresh tokens for secure, long-term authentication suitable for mobile applications.

## API Endpoints

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (revoke refresh token)
- `POST /auth/logout-all` - Logout from all devices
- `GET /auth/me` - Get current user info
- `POST /auth/revoke-token` - Revoke specific token

## Token Types

### Access Token
- Short-lived (30 minutes by default)
- Used for API requests
- Contains user information
- Sent in Authorization header

### Refresh Token
- Long-lived (7 days by default)
- Stored securely in mobile app
- Used to get new access tokens
- Can be revoked for security

## Mobile App Implementation

### 1. Token Storage

Store tokens securely in your mobile app:

```typescript
// React Native with Expo SecureStore
import * as SecureStore from 'expo-secure-store';

class TokenManager {
  static async storeTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
  }

  static async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  }

  static async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('refresh_token');
  }

  static async clearTokens() {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }
}
```

### 2. API Client with Auto-Refresh

```typescript
class ApiClient {
  private baseURL = 'http://your-api-url';
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const accessToken = await TokenManager.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        return await this.handleTokenRefresh(endpoint, options);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  private async handleTokenRefresh(endpoint: string, options: RequestInit) {
    if (this.isRefreshing) {
      // Wait for the current refresh to complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const tokens = await response.json();
        await TokenManager.storeTokens(tokens.access_token, tokens.refresh_token);
        
        // Retry the original request
        const retryResponse = await this.makeRequest(endpoint, options);
        
        // Process queued requests
        this.failedQueue.forEach(({ resolve }) => resolve(retryResponse));
        this.failedQueue = [];
        
        return retryResponse;
      } else {
        // Refresh failed, logout user
        await TokenManager.clearTokens();
        throw new Error('Session expired');
      }
    } catch (error) {
      this.failedQueue.forEach(({ reject }) => reject(error));
      this.failedQueue = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // API methods
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const tokens = await response.json();
      await TokenManager.storeTokens(tokens.access_token, tokens.refresh_token);
      return tokens;
    } else {
      throw new Error('Login failed');
    }
  }

  async logout() {
    const refreshToken = await TokenManager.getRefreshToken();
    if (refreshToken) {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
    await TokenManager.clearTokens();
  }

  async getUserInfo() {
    const response = await this.makeRequest('/auth/me');
    return response.json();
  }
}
```

### 3. React Native Context

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from './ApiClient';
import { TokenManager } from './TokenManager';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = new ApiClient();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await TokenManager.getAccessToken();
      if (accessToken) {
        const userInfo = await apiClient.getUserInfo();
        setUser(userInfo);
      }
    } catch (error) {
      // Token is invalid, clear it
      await TokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiClient.login(email, password);
      const userInfo = await apiClient.getUserInfo();
      setUser(userInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiClient.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const tokens = await response.json();
        await TokenManager.storeTokens(tokens.access_token, tokens.refresh_token);
        const userInfo = await apiClient.getUserInfo();
        setUser(userInfo);
      } else {
        throw new Error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Security Features

### 1. Token Rotation
- Refresh tokens are rotated on each use
- Old refresh tokens are automatically revoked
- Prevents token reuse attacks

### 2. Token Limits
- Maximum 5 active refresh tokens per user
- Automatic cleanup of expired tokens
- Prevents token accumulation

### 3. Revocation
- Users can revoke specific tokens
- Users can logout from all devices
- Tokens are marked as revoked in database

### 4. CORS Support
- Configured for mobile app origins
- Secure headers included

## Environment Variables

Make sure to set these in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
MAX_REFRESH_TOKENS_PER_USER=5
```

## Testing the API

You can test the endpoints using curl or Postman:

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user info (with access token)
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"YOUR_REFRESH_TOKEN"}'
```

## Best Practices

1. **Secure Storage**: Always use secure storage for tokens (Keychain on iOS, Keystore on Android)
2. **Token Refresh**: Implement automatic token refresh before expiration
3. **Error Handling**: Handle 401 errors gracefully with refresh logic
4. **Logout**: Always clear tokens on logout
5. **Network Security**: Use HTTPS in production
6. **Token Validation**: Validate tokens on app startup 