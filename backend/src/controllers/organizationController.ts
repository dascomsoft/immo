import { Request, Response, NextFunction } from 'express'
import organizationService from '../services/organizationService'

export class OrganizationController {
  /**
   * Obtenir l'organisation
   */
  async getOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId || req.params.id
      const organization = await organizationService.getOrganizationById(organizationId)

      if (!organization) {
        res.status(404).json({
          success: false,
          message: 'Organisation non trouvée',
        })
        return
      }

      res.json({
        success: true,
        data: organization,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Mettre à jour l'organisation
   */
  async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId || req.params.id
      const organization = await organizationService.updateOrganization(
        organizationId,
        req.body
      )

      if (!organization) {
        res.status(404).json({
          success: false,
          message: 'Organisation non trouvée',
        })
        return
      }

      res.json({
        success: true,
        data: organization,
        message: 'Organisation mise à jour avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload du logo
   */
  async uploadLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId || req.params.id
      const file = req.file

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const organization = await organizationService.uploadLogo(
        organizationId,
        file.buffer
      )

      res.json({
        success: true,
        data: organization,
        message: 'Logo uploadé avec succès',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new OrganizationController()