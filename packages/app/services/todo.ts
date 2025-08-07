import api from '../lib/todoApi';
import { Todo, CreateTodoData, UpdateTodoData } from '../types';

export const todoService = {
  async getTodos(): Promise<{ todos: Todo[] }> {
    const response = await api.get('/api/todos');
    return response.data;
  },

  async createTodo(data: CreateTodoData): Promise<{ todo: Todo }> {
    const response = await api.post('/api/todos', data);
    return response.data;
  },

  async updateTodo(id: number, data: UpdateTodoData): Promise<{ todo: Todo }> {
    const response = await api.put(`/api/todos/${id}`, data);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/api/todos/${id}`);
  },

  async getTodo(id: number): Promise<{ todo: Todo }> {
    const response = await api.get(`/api/todos/${id}`);
    return response.data;
  },
};
