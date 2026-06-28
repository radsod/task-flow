import { Response, NextFunction } from 'express'
import { verifyToken, AuthRequest } from '../utils/jwt.js'
import { AppError } from './errorHandler.js'
export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401))
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch {
    next(new AppError('Invalid token', 401))
  }
}