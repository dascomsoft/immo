import { Request, Response, NextFunction } from 'express'
import propertyService from '../services/propertyService'

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { organizationId } = req.user || {}
    const files = req.files as any[]

    const orgId = organizationId || req.body.organizationId
    if (!orgId) {
      res.status(400).json({
        success: false,
        message: 'Organization ID est requis',
      })
      return
    }

    const data = {
      ...req.body,
      organizationId: orgId,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      published: req.body.published === 'true' || req.body.published === true,
      features: req.body.features ? req.body.features.split(',').map((f: string) => f.trim()) : [],
    }

    console.log('📥 Données reçues:', data)
    console.log('📸 Images reçues:', files?.length || 0)

    const property = await propertyService.createProperty(data, files)
    res.status(201).json({
      success: true,
      data: property,
      message: 'Bien créé avec succès',
    })
  } catch (error) {
    console.error('❌ Erreur création:', error)
    next(error)
  }
}

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { organizationId } = req.user || {}
    const orgId = organizationId || (req.query.organizationId as string)

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 12

    const filters: any = {}
    if (req.query.transactionType) filters.transactionType = req.query.transactionType
    if (req.query.type) filters.type = req.query.type
    if (req.query.status) filters.status = req.query.status
    if (req.query.city) filters.city = req.query.city
    if (req.query.minPrice) filters.minPrice = req.query.minPrice
    if (req.query.maxPrice) filters.maxPrice = req.query.maxPrice
    if (req.query.bedrooms) filters.bedrooms = req.query.bedrooms
    if (req.query.published !== undefined) filters.published = req.query.published

    console.log('🔍 Récupération des biens...')
    console.log('📋 OrganizationId:', orgId)
    console.log('📋 Filtres:', filters)

    const result = await propertyService.getPropertiesByOrganization(
      orgId || undefined,
      filters,
      page,
      limit
    )

    console.log('📊 Biens trouvés:', result.total)

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('❌ Erreur getAll:', error)
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await propertyService.getPropertyById(req.params.id)
    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Bien non trouvé',
      })
      return
    }
    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

export const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await propertyService.getPropertyBySlug(req.params.slug)
    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Bien non trouvé',
      })
      return
    }
    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as any[]

    const data: any = { ...req.body }

    if (req.body.price !== undefined) data.price = Number(req.body.price)
    if (req.body.bedrooms !== undefined) data.bedrooms = Number(req.body.bedrooms)
    if (req.body.bathrooms !== undefined) data.bathrooms = Number(req.body.bathrooms)
    if (req.body.area !== undefined) data.area = Number(req.body.area)
    if (req.body.published !== undefined) {
      data.published = req.body.published === 'true' || req.body.published === true
    }
    if (req.body.features) {
      data.features = req.body.features.split(',').map((f: string) => f.trim())
    }

    console.log('📥 Mise à jour données:', data)
    console.log('📸 Images reçues:', files?.length || 0)

    const property = await propertyService.updateProperty(req.params.id, data, files)
    res.status(200).json({
      success: true,
      data: property,
      message: 'Bien mis à jour avec succès',
    })
  } catch (error) {
    console.error('❌ Erreur mise à jour:', error)
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await propertyService.deleteProperty(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Bien supprimé avec succès',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await propertyService.deleteImage(req.params.id, req.params.publicId)
    res.status(200).json({
      success: true,
      message: 'Image supprimée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

export const togglePublish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await propertyService.togglePublish(req.params.id)
    res.status(200).json({
      success: true,
      data: property,
      message: 'Statut de publication mis à jour',
    })
  } catch (error) {
    next(error)
  }
}
