import { Request, Response, NextFunction } from 'express'
import cloudinaryService from '../services/cloudinaryService'
import Property from '../models/Property'
import Organization from '../models/Organization'

export class UploadController {
  /**
   * Upload d'une image unique
   */
  async uploadSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file
      const { folder = 'real-estate' } = req.body

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const result = await cloudinaryService.uploadImage(
        file.buffer,
        folder,
        {
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        }
      )

      res.status(201).json({
        success: true,
        data: result,
        message: 'Image uploadée avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload multiple d'images
   */
  async uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[]
      const { folder = 'real-estate' } = req.body

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const results = await cloudinaryService.uploadMultipleImages(
        files.map(file => file.buffer),
        folder
      )

      res.status(201).json({
        success: true,
        data: results,
        message: `${results.length} images uploadées avec succès`,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Supprimer une image
   */
  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId } = req.params

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: 'publicId requis',
        })
        return
      }

      await cloudinaryService.deleteImage(publicId)

      res.json({
        success: true,
        message: 'Image supprimée avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload de l'image principale d'un bien
   */
  async uploadPropertyImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { propertyId } = req.params
      const file = req.file
      const { organizationId } = req.user

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const property = await Property.findById(propertyId)
      if (!property) {
        res.status(404).json({
          success: false,
          message: 'Bien non trouvé',
        })
        return
      }

      if (property.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce bien',
        })
        return
      }

      const folder = `real-estate/organizations/${property.organizationId}/properties/${propertyId}`
      const result = await cloudinaryService.uploadImage(
        file.buffer,
        folder,
        {
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        }
      )

      property.images.push({
        url: result.url,
        publicId: result.publicId,
      })
      await property.save()

      res.status(201).json({
        success: true,
        data: {
          image: result,
          property: property,
        },
        message: 'Image ajoutée au bien avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload multiple d'images pour un bien
   */
  async uploadPropertyImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { propertyId } = req.params
      const files = req.files as Express.Multer.File[]
      const { organizationId } = req.user

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const property = await Property.findById(propertyId)
      if (!property) {
        res.status(404).json({
          success: false,
          message: 'Bien non trouvé',
        })
        return
      }

      if (property.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce bien',
        })
        return
      }

      const folder = `real-estate/organizations/${property.organizationId}/properties/${propertyId}`
      const results = await cloudinaryService.uploadMultipleImages(
        files.map(file => file.buffer),
        folder
      )

      const newImages = results.map(result => ({
        url: result.url,
        publicId: result.publicId,
      }))
      property.images = [...property.images, ...newImages]
      await property.save()

      res.status(201).json({
        success: true,
        data: {
          images: results,
          property: property,
        },
        message: `${results.length} images ajoutées au bien avec succès`,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Supprimer une image d'un bien
   */
  async deletePropertyImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { propertyId, publicId } = req.params
      const { organizationId } = req.user

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const property = await Property.findById(propertyId)
      if (!property) {
        res.status(404).json({
          success: false,
          message: 'Bien non trouvé',
        })
        return
      }

      if (property.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce bien',
        })
        return
      }

      const imageIndex = property.images.findIndex(img => img.publicId === publicId)
      if (imageIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Image non trouvée',
        })
        return
      }

      await cloudinaryService.deleteImage(publicId)

      property.images.splice(imageIndex, 1)
      await property.save()

      res.json({
        success: true,
        data: property,
        message: 'Image supprimée avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload du logo de l'organisation
   */
  async uploadOrganizationLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const file = req.file
      const { organizationId } = req.user
      const orgId = organizationId || req.params.organizationId

      if (!orgId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const organization = await Organization.findById(orgId)
      if (!organization) {
        res.status(404).json({
          success: false,
          message: 'Organisation non trouvée',
        })
        return
      }

      if (organization.logo) {
        try {
          const oldPublicId = organization.logo.split('/').pop()?.split('.')[0]
          if (oldPublicId) {
            await cloudinaryService.deleteImage(`real-estate/organizations/${orgId}/logo/${oldPublicId}`)
          }
        } catch (error) {
          console.error('Error deleting old logo:', error)
        }
      }

      const folder = `real-estate/organizations/${orgId}/logo`
      const result = await cloudinaryService.uploadImage(
        file.buffer,
        folder,
        {
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        }
      )

      organization.logo = result.url
      await organization.save()

      res.json({
        success: true,
        data: {
          logo: result,
          organization: organization,
        },
        message: 'Logo uploadé avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Upload d'une bannière
   */
  async uploadBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const file = req.file
      const { organizationId } = req.user
      const orgId = organizationId || req.params.organizationId

      if (!orgId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const organization = await Organization.findById(orgId)
      if (!organization) {
        res.status(404).json({
          success: false,
          message: 'Organisation non trouvée',
        })
        return
      }

      const folder = `real-estate/organizations/${orgId}/banner`
      const result = await cloudinaryService.uploadImage(
        file.buffer,
        folder,
        {
          transformation: [
            { width: 1920, height: 600, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        }
      )

      res.json({
        success: true,
        data: result,
        message: 'Bannière uploadée avec succès',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Réorganiser les images d'un bien
   */
  async reorderPropertyImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
        })
        return
      }

      const { propertyId } = req.params
      const { imageOrder } = req.body
      const { organizationId } = req.user

      if (!imageOrder || !Array.isArray(imageOrder)) {
        res.status(400).json({
          success: false,
          message: 'imageOrder doit être un tableau de publicId',
        })
        return
      }

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID est requis',
        })
        return
      }

      const property = await Property.findById(propertyId)
      if (!property) {
        res.status(404).json({
          success: false,
          message: 'Bien non trouvé',
        })
        return
      }

      if (property.organizationId.toString() !== organizationId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce bien',
        })
        return
      }

      // Filtrer les images pour n'avoir que celles qui existent
      const reorderedImages = imageOrder
        .map((publicId: string) => property.images.find(img => img.publicId === publicId))
        .filter((img: any): img is { url: string; publicId: string } => img !== undefined)

      if (reorderedImages.length !== property.images.length) {
        res.status(400).json({
          success: false,
          message: 'L\'ordre fourni ne correspond pas au nombre d\'images',
        })
        return
      }

      property.images = reorderedImages
      await property.save()

      res.json({
        success: true,
        data: property,
        message: 'Images réorganisées avec succès',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new UploadController()
