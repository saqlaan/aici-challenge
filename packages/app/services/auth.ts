import api from '../lib/authApi';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/user/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/user/register', data);
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async verifyToken(token: string): Promise<{ valid: boolean; user?: any }> {
    const response = await api.post('/user/verify-token', { token });
    return response.data;
  },
};
