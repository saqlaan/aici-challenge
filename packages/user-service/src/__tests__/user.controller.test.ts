import request from 'supertest';
import express from 'express';
import { userController } from '../controllers/user.controller';
import { userService } from '../services/user.service';

// Mock the user service
jest.mock('../services/user.service');

const app = express();
app.use(express.json());
app.post('/register', userController.register);
app.post('/login', userController.login);

describe('User Controller', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 409 if user already exists', async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error('User already exists with this email')
      );

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('User already exists with this email');
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const mockLoginResult = {
        user: {
          id: 1,
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          user_email: 'test@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        token: 'mock-jwt-token',
      };

      (userService.loginUser as jest.Mock).mockResolvedValue(mockLoginResult);

      const response = await request(app)
        .post('/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockLoginResult.user);
      expect(response.body.token).toBe(mockLoginResult.token);
    });

    it('should return 401 for invalid credentials', async () => {
      (userService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const response = await request(app)
        .post('/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
