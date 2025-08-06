import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from '../database/database';
import { CreateUserDto, LoginDto, User, UserResponse, LoginResponse, JwtPayload } from '../types/user.types';
import { config } from '../config/config';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    const { user_email, user_password } = userData;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(user_email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 12);

    // Insert user
    const query = `
      INSERT INTO users (user_email, user_password)
      VALUES ($1, $2)
      RETURNING id, uuid, user_email, created_at, updated_at
    `;

    const result = await database.query(query, [user_email, hashedPassword]);
    const user = result.rows[0];

    return {
      id: user.id,
      uuid: user.uuid,
      user_email: user.user_email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async loginUser(loginData: LoginDto): Promise<LoginResponse> {
    const { user_email, user_password } = loginData;

    // Find user
    const user = await this.findUserByEmail(user_email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(user_password, user.user_password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT
    const payload: JwtPayload = {
      userId: user.id,
      userUuid: user.uuid,
      user_email: user.user_email,
    };


    const token = jwt.sign(payload, config.jwtSecret, 
    //     {
    //   expiresIn: config.jwtExpiresIn,
    // }
);

    const userResponse: UserResponse = {
      id: user.id,
      uuid: user.uuid,
      user_email: user.user_email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userResponse,
      token,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE user_email = $1';
    const result = await database.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      uuid: user.uuid,
      user_email: user.user_email,
      user_password: user.user_password,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async findUserById(id: number): Promise<UserResponse | null> {
    const query = 'SELECT id, uuid, user_email, created_at, updated_at FROM users WHERE id = $1';
    const result = await database.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      uuid: user.uuid,
      user_email: user.user_email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const userService = new UserService();
