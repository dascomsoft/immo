import { Request, Response, NextFunction } from 'express'

// Utiliser require pour express-validator
const { check, validationResult } = require('express-validator')

export const validateProperty = [
  check('title').notEmpty().withMessage('Le titre est requis'),
  check('description').notEmpty().withMessage('La description est requise'),
  check('type').notEmpty().withMessage('Le type est requis'),
  check('transactionType').notEmpty().withMessage('Le type de transaction est requis'),
  check('price').isNumeric().withMessage('Le prix doit être un nombre'),
  check('city').notEmpty().withMessage('La ville est requise'),
  check('address').notEmpty().withMessage('L\'adresse est requise'),
  check('area').isNumeric().withMessage('La superficie doit être un nombre'),
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
  check('name').notEmpty().withMessage('Le nom est requis'),
  check('phone').notEmpty().withMessage('Le téléphone est requis'),
  check('email').isEmail().withMessage('Email invalide'),
  check('message').notEmpty().withMessage('Le message est requis'),
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
  check('name').notEmpty().withMessage('Le nom est requis'),
  check('phone').notEmpty().withMessage('Le téléphone est requis'),
  check('email').isEmail().withMessage('Email invalide'),
  check('propertyId').notEmpty().withMessage('Le bien est requis'),
  check('preferredDate').isISO8601().withMessage('Date invalide'),
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
