import request from 'supertest';
import express from 'express';
import { userController } from '../controllers/user.controller';
import { userService } from '../services/user.service';
import { validationResult } from 'express-validator';

jest.mock('../services/user.service');
jest.mock('express-validator');
const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;

let app: express.Application;

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    app.post('/register', userController.register);
    app.post('/login', userController.login);

    mockedValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    } as any);
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserService.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toEqual({
        ...mockUser,
        created_at: mockUser.created_at.toISOString(),
        updated_at: mockUser.updated_at.toISOString(),
      });
      expect(mockedUserService.createUser).toHaveBeenCalledWith({
        user_email: 'test@example.com',
        user_password: 'password123',
      });
    });

    it('should return 409 if user already exists', async () => {
      mockedUserService.createUser.mockRejectedValue(
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

    it('should return 400 for validation errors', async () => {
      mockedValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { msg: 'Invalid email format', param: 'user_email', location: 'body', value: 'invalid-email' },
          { msg: 'Password must be at least 6 characters', param: 'user_password', location: 'body', value: '123' }
        ]
      } as any);

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'invalid-email',
          user_password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(response.body.errors[0].msg).toBe('Invalid email format');
      expect(response.body.errors[1].msg).toBe('Password must be at least 6 characters');
    });

    it('should return 500 for unexpected errors', async () => {
      mockedUserService.createUser.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should return 500 for non-Error exceptions', async () => {
      mockedUserService.createUser.mockRejectedValue('Unexpected error');

      const response = await request(app)
        .post('/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
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

      mockedUserService.loginUser.mockResolvedValue(mockLoginResult);

      const response = await request(app)
        .post('/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toEqual({
        ...mockLoginResult.user,
        created_at: mockLoginResult.user.created_at.toISOString(),
        updated_at: mockLoginResult.user.updated_at.toISOString(),
      });
      expect(response.body.token).toBe(mockLoginResult.token);
      expect(mockedUserService.loginUser).toHaveBeenCalledWith({
        user_email: 'test@example.com',
        user_password: 'password123',
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockedUserService.loginUser.mockRejectedValue(
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

    it('should return 400 for validation errors', async () => {
      mockedValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { msg: 'Email is required', param: 'user_email', location: 'body', value: undefined }
        ]
      } as any);

      const response = await request(app)
        .post('/login')
        .send({
          user_password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe('Email is required');
    });

    it('should return 500 for unexpected errors', async () => {
      mockedUserService.loginUser.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should not return password in the login response', async () => {
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

      mockedUserService.loginUser.mockResolvedValue(mockLoginResult);

      const response = await request(app)
        .post('/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user).not.toHaveProperty('user_password');
      expect(response.body.user).not.toHaveProperty('password');

      expect(response.body.user).toEqual({
        id: mockLoginResult.user.id,
        uuid: mockLoginResult.user.uuid,
        user_email: mockLoginResult.user.user_email,
        created_at: mockLoginResult.user.created_at.toISOString(),
        updated_at: mockLoginResult.user.updated_at.toISOString(),
      });

      const responseString = JSON.stringify(response.body);
      expect(responseString).not.toContain('password');
      expect(responseString).not.toContain('user_password');
    });
  });

  describe('GET /profile', () => {
    const mockAuthMiddleware = (req: any, res: any, next: any) => {
      req.user = { userId: 1, userUuid: '123e4567-e89b-12d3-a456-426614174000', user_email: 'test@example.com' };
      next();
    };

    const mockAuthMiddlewareUnauthorized = (req: any, res: any, next: any) => {
      return res.status(401).json({ error: 'User not authenticated' });
    };

    beforeEach(() => {
      app.get('/profile', mockAuthMiddleware, userController.getProfile);
    });

    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 1,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        user_email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserService.findUserById.mockResolvedValue(mockUser);

      const response = await request(app).get('/profile');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({
        ...mockUser,
        created_at: mockUser.created_at.toISOString(),
        updated_at: mockUser.updated_at.toISOString(),
      });
      expect(mockedUserService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should return 401 if user not authenticated', async () => {
      const appUnauthorized = express();
      appUnauthorized.use(express.json());
      appUnauthorized.get('/profile', mockAuthMiddlewareUnauthorized, userController.getProfile);

      const response = await request(appUnauthorized).get('/profile');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
      expect(mockedUserService.findUserById).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockedUserService.findUserById.mockResolvedValue(null);

      const response = await request(app).get('/profile');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
      expect(mockedUserService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should return 500 for unexpected errors', async () => {
      mockedUserService.findUserById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/profile');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
      expect(mockedUserService.findUserById).toHaveBeenCalledWith(1);
    });
  });
});
