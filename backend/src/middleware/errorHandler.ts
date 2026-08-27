import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err)

  // Erreur Mongoose - Validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el: any) => el.message)
    res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors,
    })
    return
  }

  // Erreur Mongoose - Duplication
  if (err.code === 11000) {
    res.status(400).json({
      success: false,
      message: 'Erreur de duplication',
      field: Object.keys(err.keyPattern)[0],
    })
    return
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token invalide',
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expiré',
    })
    return
  }

  // Erreur Multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux (max 5MB)',
      })
      return
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        message: 'Trop de fichiers (max 10)',
      })
      return
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({
        success: false,
        message: 'Fichier inattendu',
      })
      return
    }
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
