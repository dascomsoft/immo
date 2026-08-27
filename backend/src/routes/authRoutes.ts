import express from 'express'
import authController from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// Routes publiques
router.post('/login', authController.login)
router.post('/register', authController.register)

// Routes protégées
router.get('/me', authMiddleware, authController.getMe)
router.put('/me', authMiddleware, authController.updateMe)

export default router