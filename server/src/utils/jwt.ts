import jwt from 'jsonwebtoken'
import { Request } from 'express'
export interface TokenPayload {
    userId: number
    email: string
}
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}
export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
}
export interface AuthRequest extends Request {
    user?: TokenPayload
}