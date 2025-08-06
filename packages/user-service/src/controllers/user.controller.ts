import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { userService } from '../services/user.service';
import { CreateUserDto, LoginDto } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists with this email') {
          res.status(409).json({ error: error.message });
          return;
        }
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const loginData: LoginDto = req.body;
      const result = await userService.loginUser(loginData);

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials') {
          res.status(401).json({ error: error.message });
          return;
        }
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await userService.findUserById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
      }

      const decoded = userService.verifyToken(token);
      const user = await userService.findUserById(decoded.userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ 
        valid: true, 
        user: decoded 
      });
    } catch (error) {
      res.status(401).json({ 
        valid: false, 
        error: 'Invalid token' 
      });
    }
  }
}

export const userController = new UserController();
