import { Request, Response, NextFunction } from 'express'
import Property from '../models/Property'
import ContactRequest from '../models/ContactRequest'
import VisitRequest from '../models/VisitRequest'

export class DashboardController {
  /**
   * Obtenir les statistiques du tableau de bord
   */
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Vérifier que req.user existe
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { organizationId } = req.user

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const [
        totalProperties,
        availableProperties,
        soldProperties,
        rentedProperties,
        pendingRequests,
        visitRequests,
        recentProperties,
        recentRequests,
      ] = await Promise.all([
        Property.countDocuments({ organizationId }),
        Property.countDocuments({ organizationId, status: 'AVAILABLE', published: true }),
        Property.countDocuments({ organizationId, status: 'SOLD' }),
        Property.countDocuments({ organizationId, status: 'RENTED' }),
        ContactRequest.countDocuments({ organizationId, status: 'PENDING' }),
        VisitRequest.countDocuments({ organizationId, status: 'PENDING' }),
        Property.find({ organizationId, published: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title price city images'),
        ContactRequest.find({ organizationId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('propertyId', 'title'),
      ])

      res.json({
        success: true,
        data: {
          totalProperties,
          availableProperties,
          soldProperties,
          rentedProperties,
          pendingRequests,
          visitRequests,
          recentProperties,
          recentRequests,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Obtenir les statistiques des biens
   */
  async getPropertyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Vérifier que req.user existe
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { organizationId } = req.user

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const stats = await Property.aggregate([
        { $match: { organizationId } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            totalValue: { $sum: '$price' },
          },
        },
        { $sort: { count: -1 } },
      ])

      res.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new DashboardController()
