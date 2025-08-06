export interface Todo {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTodoDto {
  content: string;
}

export interface UpdateTodoDto {
  content?: string;
}

export interface TodoResponse {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  userId: number;
  userUuid: string;
  user_email: string;
}
