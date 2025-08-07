import api from '../lib/authApi';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/users/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/users/register', data);
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  async verifyToken(token: string): Promise<{ valid: boolean; user?: any }> {
    const response = await api.post('/api/users/verify-token', { token });
    return response.data;
  },
};
