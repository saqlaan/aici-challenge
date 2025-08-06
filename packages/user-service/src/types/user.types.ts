export interface User {
  id: number;
  uuid: string;
  user_email: string;
  user_password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  user_email: string;
  user_password: string;
}

export interface LoginDto {
  user_email: string;
  user_password: string;
}

export interface UserResponse {
  id: number;
  uuid: string;
  user_email: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface JwtPayload {
  userId: number;
  userUuid: string;
  user_email: string;
}
