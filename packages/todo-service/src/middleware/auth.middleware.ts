import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtPayload } from '../types/todo.types';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    userUuid: string;
    user_email: string;
  };
  userUuid?: string;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    
    // Validate required fields in the JWT payload
    if (!decoded.userId || !decoded.userUuid || !decoded.user_email) {
      res.status(403).json({ error: 'Invalid token payload' });
      return;
    }

    // Set user data on request object
    req.user = decoded;
    req.userUuid = decoded.userUuid; // Convenient access to UUID
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token format' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: 'Token has expired' });
    } else {
      res.status(403).json({ error: 'Token verification failed' });
    }
  }
};

export const extractUserUuid = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user || !req.user.userUuid) {
      res.status(401).json({ error: 'User authentication required' });
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.user.userUuid)) {
      res.status(400).json({ error: 'Invalid UUID format' });
      return;
    }

    req.userUuid = req.user.userUuid;
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during UUID extraction' });
  }
};
