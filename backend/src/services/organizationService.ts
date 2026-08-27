import Organization, { IOrganization } from '../models/Organization'
import cloudinaryService from './cloudinaryService'

class OrganizationService {
  /**
   * Créer une organisation
   */
  async createOrganization(data: Partial<IOrganization>): Promise<IOrganization> {
    const organization = new Organization(data)
    await organization.save()
    return organization
  }

  /**
   * Obtenir une organisation par son ID
   */
  async getOrganizationById(id: string): Promise<IOrganization | null> {
    return Organization.findById(id)
  }

  /**
   * Mettre à jour une organisation
   */
  async updateOrganization(id: string, data: Partial<IOrganization>): Promise<IOrganization | null> {
    return Organization.findByIdAndUpdate(id, data, { new: true })
  }

  /**
   * Upload du logo
   */
  async uploadLogo(id: string, fileBuffer: Buffer): Promise<IOrganization | null> {
    const organization = await Organization.findById(id)
    if (!organization) {
      throw new Error('Organisation non trouvée')
    }

    // Supprimer l'ancien logo si existant
    if (organization.logo) {
      try {
        const publicId = organization.logo.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinaryService.deleteImage(`real-estate/organizations/${id}/logo/${publicId}`)
        }
      } catch (error) {
        console.error('Error deleting old logo:', error)
      }
    }

    const result = await cloudinaryService.uploadImage(
      fileBuffer,
      `real-estate/organizations/${id}/logo`
    )

    organization.logo = result.url
    await organization.save()

    return organization
  }

  /**
   * Vérifier si une organisation existe
   */
  async organizationExists(id: string): Promise<boolean> {
    const count = await Organization.countDocuments({ _id: id })
    return count > 0
  }

  /**
   * Supprimer une organisation
   */
  async deleteOrganization(id: string): Promise<void> {
    await Organization.findByIdAndDelete(id)
  }
}

export default new OrganizationService()