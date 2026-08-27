import Property, { IProperty } from '../models/Property'
import cloudinaryService from './cloudinaryService'
import { generateSlug } from '../utils/slugify'
import Organization from '../models/Organization'

class PropertyService {
  async createProperty(data: Partial<IProperty>, images?: any[]): Promise<IProperty> {
    let uploadedImages: { url: string; publicId: string }[] = []

    if (images && images.length > 0) {
      const folder = `real-estate/organizations/${data.organizationId}/properties`
      const results = await cloudinaryService.uploadMultipleImages(
        images.map((img: any) => img.buffer),
        folder
      )
      uploadedImages = results.map((result: any) => ({
        url: result.url,
        publicId: result.publicId,
      }))
    }

    const slug = generateSlug(data.title || '')

    const property = new Property({
      ...data,
      slug,
      images: uploadedImages,
      status: data.status || 'AVAILABLE',
      published: data.published !== undefined ? data.published : true,
    })

    await property.save()
    return property
  }

  async updateProperty(id: string, data: Partial<IProperty>, images?: any[]): Promise<IProperty> {
    const property = await Property.findById(id)
    if (!property) {
      throw new Error('Bien non trouvé')
    }

    let uploadedImages = [...property.images]
    if (images && images.length > 0) {
      const folder = `real-estate/organizations/${property.organizationId}/properties`
      const results = await cloudinaryService.uploadMultipleImages(
        images.map((img: any) => img.buffer),
        folder
      )
      const newImages = results.map((result: any) => ({
        url: result.url,
        publicId: result.publicId,
      }))
      uploadedImages = [...uploadedImages, ...newImages]
    }

    let slug = property.slug
    if (data.title && data.title !== property.title) {
      slug = generateSlug(data.title)
    }

    Object.assign(property, {
      ...data,
      slug,
      images: uploadedImages,
    })

    await property.save()
    return property
  }

  async deleteProperty(id: string): Promise<void> {
    const property = await Property.findById(id)
    if (!property) {
      throw new Error('Bien non trouvé')
    }

    const publicIds = property.images.map((img: any) => img.publicId)
    if (publicIds.length > 0) {
      await cloudinaryService.deleteMultipleImages(publicIds)
    }

    await Property.findByIdAndDelete(id)
  }

  async deleteImage(propertyId: string, publicId: string): Promise<IProperty> {
    const property = await Property.findById(propertyId)
    if (!property) {
      throw new Error('Bien non trouvé')
    }

    const image = property.images.find((img: any) => img.publicId === publicId)
    if (image) {
      await cloudinaryService.deleteImage(publicId)
      property.images = property.images.filter((img: any) => img.publicId !== publicId)
      await property.save()
    }

    return property
  }

  async togglePublish(id: string): Promise<IProperty> {
    const property = await Property.findById(id)
    if (!property) {
      throw new Error('Bien non trouvé')
    }

    property.published = !property.published
    await property.save()
    return property
  }

  async getPropertiesByOrganization(
    organizationId: string | undefined,
    filters: any = {},
    page: number = 1,
    limit: number = 12
  ) {
    const query: any = {}

    if (organizationId) {
      query.organizationId = organizationId
    } else {
      // Si pas d'organizationId, récupérer toutes les organisations
      const orgs = await Organization.find()
      if (orgs.length > 0) {
        query.organizationId = { $in: orgs.map(o => o._id) }
      }
    }

    if (filters.transactionType) query.transactionType = filters.transactionType
    if (filters.type) query.type = filters.type
    if (filters.status) query.status = filters.status
    if (filters.city) query.city = { $regex: filters.city, $options: 'i' }
    if (filters.minPrice || filters.maxPrice) {
      query.price = {}
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice)
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice)
    }
    if (filters.bedrooms) query.bedrooms = { $gte: Number(filters.bedrooms) }

    if (filters.published !== undefined) {
      query.published = filters.published === 'true' || filters.published === true
    } else if (!organizationId) {
      query.published = true
    }

    console.log('🔍 Query MongoDB:', JSON.stringify(query, null, 2))

    const skip = (page - 1) * limit
    const total = await Property.countDocuments(query)

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('organizationId', 'name logo')

    return {
      data: properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getPropertyBySlug(slug: string): Promise<IProperty | null> {
    return Property.findOne({ slug }).populate('organizationId', 'name logo phone email whatsapp')
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    return Property.findById(id).populate('organizationId', 'name logo phone email whatsapp')
  }

  async getSimilarProperties(propertyId: string, limit: number = 3): Promise<IProperty[]> {
    const property = await Property.findById(propertyId)
    if (!property) {
      return []
    }

    return Property.find({
      _id: { $ne: propertyId },
      organizationId: property.organizationId,
      transactionType: property.transactionType,
      status: 'AVAILABLE',
      published: true,
    })
      .limit(limit)
      .sort({ createdAt: -1 })
  }
}

export default new PropertyService()
