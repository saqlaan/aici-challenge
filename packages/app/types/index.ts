export interface User {
  id: number;
  uuid: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  content: string;
}

export interface UpdateTodoData {
  content?: string;
}

export interface LoginData {
  user_email: string;
  user_password: string;
}

export interface RegisterData {
  user_email: string;
  user_password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
