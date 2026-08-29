import { api } from './api'
import { Property, PropertyFilters, PaginatedResponse } from '@/types'

export const propertyService = {
  async getProperties(filters?: PropertyFilters, page?: number, limit?: number): Promise<PaginatedResponse<Property>> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
      }
      if (page) params.append('page', String(page))
      if (limit) params.append('limit', String(limit))
      
      const url = `/properties?${params.toString()}`
      console.log('📤 Récupération des biens depuis:', url)
      
      const response = await api.get<PaginatedResponse<Property>>(url)
      console.log('📥 Réponse reçue:', response)
      
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des biens:', error)
      throw error
    }
  },

  async getProperty(id: string): Promise<Property> {
    try {
      console.log(`📤 Récupération du bien ${id}`)
      const response = await api.get<any>(`/properties/${id}`)
      console.log(`📥 Bien récupéré:`, response)
      
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération du bien ${id}:`, error)
      throw error
    }
  },

  async getPropertyBySlug(slug: string): Promise<Property> {
    try {
      const response = await api.get<any>(`/properties/slug/${slug}`)
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du bien par slug:', error)
      throw error
    }
  },

  async createProperty(data: Partial<Property>): Promise<Property> {
    try {
      console.log('📤 Création d\'un nouveau bien:', data)
      const response = await api.post<any>('/properties', data)
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la création du bien:', error)
      throw error
    }
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    try {
      console.log(`📤 Mise à jour du bien ${id}:`, data)
      const response = await api.put<any>(`/properties/${id}`, data)
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du bien:', error)
      throw error
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      console.log(`📤 Suppression du bien ${id}`)
      await api.delete(`/properties/${id}`)
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du bien:', error)
      throw error
    }
  },

  async togglePublish(id: string): Promise<Property> {
    try {
      console.log(`📤 Publication du bien ${id}`)
      const response = await api.patch<any>(`/properties/${id}/publish`)
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error)
      throw error
    }
  },

  async deleteImage(propertyId: string, publicId: string): Promise<Property> {
    try {
      console.log(`📤 Suppression de l'image ${publicId} du bien ${propertyId}`)
      const response = await api.delete<any>(`/properties/${propertyId}/images/${publicId}`)
      if (response && response.data) {
        return response.data
      }
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'image:', error)
      throw error
    }
  },
}
