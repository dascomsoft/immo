import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const validateProperty = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('type').notEmpty().withMessage('Le type est requis'),
  body('transactionType').notEmpty().withMessage('Le type de transaction est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('city').notEmpty().withMessage('La ville est requise'),
  body('address').notEmpty().withMessage('L\'adresse est requise'),
  body('area').isNumeric().withMessage('La superficie doit être un nombre'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      })
      return
    }
    next()
  },
]

export const validateContact = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('message').notEmpty().withMessage('Le message est requis'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      })
      return
    }
    next()
  },
]

export const validateVisit = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('propertyId').notEmpty().withMessage('Le bien est requis'),
  body('preferredDate').isISO8601().withMessage('Date invalide'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      })
      return
    }
    next()
  },
]