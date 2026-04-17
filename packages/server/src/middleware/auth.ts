import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '#src/controller/auth.ts';

export interface AuthRequest extends Request {
  user?: { userId: number };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
    return;
  }

  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ status: 401, message: 'Invalid or expired token' });
  }
}
