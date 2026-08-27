import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        organizationId: string
        role: string
      }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    console.log('🔑 Token reçu:', token ? 'Présent' : 'Absent')

    if (!token) {
      console.log('❌ Pas de token')
      res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.',
      })
      return
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string
        email: string
        organizationId: string
        role: string
      }

      console.log('✅ Token décodé:', decoded)
      req.user = decoded
      next()
    } catch (jwtError) {
      console.log('❌ Token invalide:', jwtError)
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      })
    }
  } catch (error) {
    console.error('❌ Erreur auth:', error)
    next(error)
  }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    })
    return
  }
  next()
}
