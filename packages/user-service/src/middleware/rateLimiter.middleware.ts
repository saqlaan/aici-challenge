import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction, Response, Request } from "express";

const ipLimiter = new RateLimiterMemory({
  keyPrefix: 'login_ip',
  points: 5,
  duration: 60,         
  blockDuration: 60 * 5 // if exceeded, block for 5 minutes
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    await ipLimiter.consume(ip || 'unknown_ip');
    next();
  } catch (error) {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
};