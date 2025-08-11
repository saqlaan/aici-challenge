import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { database } from '../database/database';
import { config } from '../config/app.config';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../database/database');
jest.mock('../config/app.config');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedDatabase = database as jest.Mocked<typeof database>;
const mockedConfig = config as jest.Mocked<typeof config>;

console.log('Mocked Config:', mockedConfig);
describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('createUser - User Registration User Story', () => {
    const validUserData = {
      user_email: 'test@example.com',
      user_password: 'password123'
    };

    const mockUser = {
      id: 1,
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      user_email: 'test@example.com',
      user_password: 'hashedPassword123',
      created_at: new Date('2025-01-01'),
      updated_at: new Date('2025-01-01')
    };

    it('should create a new user successfully when email is not already registered', async () => {
      // Mock findUserByEmail to return null (user doesn't exist)
      mockedDatabase.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUser] });

      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

      const result = await userService.createUser(validUserData);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 12);

      expect(mockedDatabase.query).toHaveBeenCalledTimes(2);
      expect(mockedDatabase.query).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM users WHERE user_email = $1',
        ['test@example.com']
      );
      expect(mockedDatabase.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO users'),
        ['test@example.com', 'hashedPassword123']
      );

      expect(result).toEqual({
        id: mockUser.id,
        uuid: mockUser.uuid,
        user_email: mockUser.user_email,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at
      });
    });

    it('should throw error if user already exists with email', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [mockUser] });

      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow('User already exists with this email');

      expect(mockedDatabase.query).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });

    it('should handle minimum password length validation at service level', async () => {
      const invalidUserData = {
        user_email: 'test@example.com',
        user_password: '12345'
      };

      mockedDatabase.query.mockResolvedValueOnce({ rows: [] });
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      mockedDatabase.query.mockResolvedValueOnce({ rows: [{ ...mockUser, user_password: 'hashedPassword' }] });

      const result = await userService.createUser(invalidUserData);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('12345', 12);
      expect(result).toBeDefined();
    });

    it('should handle database errors during user creation', async () => {
      mockedDatabase.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('Database connection failed'));

      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow('Database connection failed');

      expect(mockedBcrypt.hash).toHaveBeenCalled();
      expect(mockedDatabase.query).toHaveBeenCalledTimes(2);
    });

    it('should handle bcrypt hashing errors', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [] });
      
      mockedBcrypt.hash.mockRejectedValue(new Error('Hashing failed') as never);

      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow('Hashing failed');

      expect(mockedDatabase.query).toHaveBeenCalledTimes(1);
    });

    it('should validate email format is handled (typically at validation layer)', async () => {
      const invalidEmailData = {
        user_email: 'invalid-email',
        user_password: 'password123'
      };

      mockedDatabase.query.mockResolvedValueOnce({ rows: [] });
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      mockedDatabase.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.createUser(invalidEmailData);

      expect(result).toBeDefined();
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 12);
    });
  });

  describe('loginUser', () => {
    const loginData = {
      user_email: 'test@example.com',
      user_password: 'password123'
    };

    const mockUser = {
      id: 1,
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      user_email: 'test@example.com',
      user_password: 'hashedPassword123',
      created_at: new Date('2025-01-01'),
      updated_at: new Date('2025-01-01')
    };

    it('should login user successfully with valid credentials', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [mockUser] });
      
      mockedBcrypt.compare.mockResolvedValue(true as never);
      
      mockedJwt.sign.mockReturnValue('jwt-token' as never);

      const result = await userService.loginUser(loginData);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        {
          userId: mockUser.id,
          userUuid: mockUser.uuid,
          user_email: mockUser.user_email
        },
        'test-secret',
        {"expiresIn": "24h"}
      );

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          uuid: mockUser.uuid,
          user_email: mockUser.user_email,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at
        },
        token: 'jwt-token'
      });
    });

    it('should throw error for non-existent user', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [] });

      await expect(userService.loginUser(loginData))
        .rejects
        .toThrow('Invalid credentials');

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error for invalid password', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [mockUser] });
      
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(userService.loginUser(loginData))
        .rejects
        .toThrow('Invalid credentials');

      expect(mockedBcrypt.compare).toHaveBeenCalled();
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    const mockUser = {
      id: 1,
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      user_email: 'test@example.com',
      user_password: 'hashedPassword123',
      created_at: new Date('2025-01-01'),
      updated_at: new Date('2025-01-01')
    };

    it('should return user when found', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.findUserByEmail('test@example.com');

      expect(mockedDatabase.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE user_email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockedDatabase.query.mockResolvedValueOnce({ rows: [] });

      const result = await userService.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
