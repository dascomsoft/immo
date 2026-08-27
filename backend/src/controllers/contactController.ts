import { Request, Response, NextFunction } from 'express'
import ContactRequest from '../models/ContactRequest'
import VisitRequest from '../models/VisitRequest'
import Organization from '../models/Organization'
import Property from '../models/Property'
import whatsappService from '../services/whatsappService'

export class ContactController {
  // ============================================
  // ROUTES PUBLIQUES
  // ============================================

  async sendContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      
      let orgId = organizationId || req.body.organizationId
      if (!orgId) {
        const firstOrg = await Organization.findOne()
        if (firstOrg) {
          orgId = firstOrg._id.toString()
        } else {
          res.status(400).json({
            success: false,
            message: 'Aucune organisation trouvée',
          })
          return
        }
      }

      const data = {
        ...req.body,
        organizationId: orgId,
      }

      const contact = new ContactRequest(data)
      await contact.save()

      // Notification WhatsApp (optionnelle)
      try {
        const organization = await Organization.findById(orgId)
        const property = data.propertyId ? await Property.findById(data.propertyId) : null

        if (organization) {
          whatsappService.notifyAdminContact({
            clientName: data.name,
            clientPhone: data.phone,
            clientEmail: data.email,
            requestType: data.requestType,
            message: data.message,
            propertyTitle: property?.title,
          })
        }
      } catch (whatsappError) {
        console.error('❌ Erreur WhatsApp (ignorée):', whatsappError)
      }

      res.status(201).json({
        success: true,
        data: contact,
        message: 'Demande envoyée avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur sendContact:', error)
      next(error)
    }
  }

  async sendVisit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      
      let orgId = organizationId || req.body.organizationId
      if (!orgId) {
        const firstOrg = await Organization.findOne()
        if (firstOrg) {
          orgId = firstOrg._id.toString()
        } else {
          res.status(400).json({
            success: false,
            message: 'Aucune organisation trouvée',
          })
          return
        }
      }

      const data = {
        ...req.body,
        organizationId: orgId,
        preferredDate: new Date(req.body.preferredDate),
      }

      const visit = new VisitRequest(data)
      await visit.save()

      // Notifications WhatsApp (optionnelles)
      try {
        const organization = await Organization.findById(orgId)
        const property = await Property.findById(data.propertyId)

        if (organization && property) {
          whatsappService.notifyAdminVisit({
            clientName: data.name,
            clientPhone: data.phone,
            propertyTitle: property.title,
            preferredDate: data.preferredDate,
            message: data.message,
          })

          whatsappService.sendConfirmationToClient({
            clientName: data.name,
            clientPhone: data.phone,
            propertyTitle: property.title,
            preferredDate: data.preferredDate,
            message: data.message,
          })
        }
      } catch (whatsappError) {
        console.error('❌ Erreur WhatsApp (ignorée):', whatsappError)
      }

      res.status(201).json({
        success: true,
        data: visit,
        message: 'Demande de visite envoyée avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur sendVisit:', error)
      next(error)
    }
  }

  // ============================================
  // ROUTES ADMIN - DEMANDES DE CONTACT
  // ============================================

  async getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      
      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const { status, page = 1, limit = 20 } = req.query

      const query: any = { organizationId }
      if (status) query.status = status

      const skip = (Number(page) - 1) * Number(limit)
      const total = await ContactRequest.countDocuments(query)

      const contacts = await ContactRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('propertyId', 'title slug price city')

      res.json({
        success: true,
        data: contacts,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      })
    } catch (error) {
      console.error('❌ Erreur getContacts:', error)
      next(error)
    }
  }

  async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { organizationId } = req.user || {}

      const contact = await ContactRequest.findById(id)
        .populate('propertyId', 'title slug price city images')

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Demande non trouvée',
        })
        return
      }

      if (contact.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      res.json({
        success: true,
        data: contact,
      })
    } catch (error) {
      console.error('❌ Erreur getContactById:', error)
      next(error)
    }
  }

  async updateContactStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { status } = req.body
      const { organizationId } = req.user || {}

      const contact = await ContactRequest.findById(id)
      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Demande non trouvée',
        })
        return
      }

      if (contact.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      contact.status = status
      await contact.save()

      res.json({
        success: true,
        data: contact,
        message: 'Statut mis à jour avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur updateContactStatus:', error)
      next(error)
    }
  }

  async deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { organizationId } = req.user || {}

      const contact = await ContactRequest.findById(id)
      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Demande non trouvée',
        })
        return
      }

      if (contact.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      await ContactRequest.findByIdAndDelete(id)

      res.json({
        success: true,
        message: 'Demande supprimée avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur deleteContact:', error)
      next(error)
    }
  }

  // ============================================
  // ROUTES ADMIN - DEMANDES DE VISITE
  // ============================================

  async getVisits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      
      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const { status, page = 1, limit = 20 } = req.query

      const query: any = { organizationId }
      if (status) query.status = status

      const skip = (Number(page) - 1) * Number(limit)
      const total = await VisitRequest.countDocuments(query)

      const visits = await VisitRequest.find(query)
        .sort({ preferredDate: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('propertyId', 'title slug price city images')

      res.json({
        success: true,
        data: visits,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      })
    } catch (error) {
      console.error('❌ Erreur getVisits:', error)
      next(error)
    }
  }

  async getVisitById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { organizationId } = req.user || {}

      const visit = await VisitRequest.findById(id)
        .populate('propertyId', 'title slug price city images')

      if (!visit) {
        res.status(404).json({
          success: false,
          message: 'Demande de visite non trouvée',
        })
        return
      }

      if (visit.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      res.json({
        success: true,
        data: visit,
      })
    } catch (error) {
      console.error('❌ Erreur getVisitById:', error)
      next(error)
    }
  }

  async updateVisitStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { status } = req.body
      const { organizationId } = req.user || {}

      const visit = await VisitRequest.findById(id)
      if (!visit) {
        res.status(404).json({
          success: false,
          message: 'Demande de visite non trouvée',
        })
        return
      }

      if (visit.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      visit.status = status
      await visit.save()

      res.json({
        success: true,
        data: visit,
        message: 'Statut mis à jour avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur updateVisitStatus:', error)
      next(error)
    }
  }

  async deleteVisit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { organizationId } = req.user || {}

      const visit = await VisitRequest.findById(id)
      if (!visit) {
        res.status(404).json({
          success: false,
          message: 'Demande de visite non trouvée',
        })
        return
      }

      if (visit.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé',
        })
        return
      }

      await VisitRequest.findByIdAndDelete(id)

      res.json({
        success: true,
        message: 'Demande de visite supprimée avec succès',
      })
    } catch (error) {
      console.error('❌ Erreur deleteVisit:', error)
      next(error)
    }
  }

  // ============================================
  // STATISTIQUES
  // ============================================

  async getRequestStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationId } = req.user || {}
      
      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const [
        totalContacts,
        pendingContacts,
        totalVisits,
        pendingVisits,
      ] = await Promise.all([
        ContactRequest.countDocuments({ organizationId }),
        ContactRequest.countDocuments({ organizationId, status: 'PENDING' }),
        VisitRequest.countDocuments({ organizationId }),
        VisitRequest.countDocuments({ organizationId, status: 'PENDING' }),
      ])

      res.json({
        success: true,
        data: {
          totalContacts,
          pendingContacts,
          totalVisits,
          pendingVisits,
        },
      })
    } catch (error) {
      console.error('❌ Erreur getRequestStats:', error)
      next(error)
    }
  }
}

export default new ContactController()
