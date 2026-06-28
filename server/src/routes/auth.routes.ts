import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import prisma from '../utils/prisma.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import { auth } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { AuthRequest } from '../utils/jwt.js'
import { AppError } from '../middleware/errorHandler.js'
const router = Router()
// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      throw new AppError('User already exists', 409)
    }
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })
    const token = generateToken({
      userId: user.id,
      email: user.email
    })
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    next(error)
  }
})
// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }
    const token = generateToken({
      userId: user.id,
      email: user.email
    })
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    next(error)
  }
})
// GET /api/auth/me
router.get('/me', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
})
export default router