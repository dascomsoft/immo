import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import organizationService from '../services/organizationService'

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      console.log('🔐 Tentative de login:', email)

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis',
        })
        return
      }

      const result = await authService.login(email, password)

      console.log('✅ Login réussi pour:', email)

      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: 'Connexion réussie',
      })
    } catch (error: any) {
      console.error('❌ Erreur login:', error)
      
      // Ne pas envoyer les détails de l'erreur en production
      const message = error.message || 'Erreur lors de la connexion'
      res.status(500).json({
        success: false,
        message,
      })
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      const data = {
        ...req.body,
        organizationId: organizationId || req.body.organizationId,
        role: req.body.role || 'VIEWER',
      }

      const exists = await organizationService.organizationExists(data.organizationId)
      if (!exists) {
        res.status(400).json({
          success: false,
          message: 'Organisation invalide',
        })
        return
      }

      const user = await authService.createUser(data)

      res.status(201).json({
        success: true,
        data: user,
        message: 'Utilisateur créé avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const userId = req.user.id
      const user = await authService.getUserById(userId)

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        })
        return
      }

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const userId = req.user.id
      const user = await authService.updateUser(userId, req.body)

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        })
        return
      }

      res.json({
        success: true,
        data: user,
        message: 'Profil mis à jour avec succès',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
