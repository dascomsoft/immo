import { api } from './api'
import { Property, PropertyFilters, PaginatedResponse } from '@/types'

export const propertyService = {
  async getProperties(filters?: PropertyFilters, page?: number, limit?: number): Promise<PaginatedResponse<Property>> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') params.append(key, String(value))
        })
      }
      if (page) params.append('page', String(page))
      if (limit) params.append('limit', String(limit))
      return api.get(`/properties?${params.toString()}`)
    } catch (error) {
      console.error('❌ Erreur:', error)
      throw error
    }
  },

  async getProperty(id: string): Promise<Property> {
    try {
      const response = await api.get<any>(`/properties/${id}`)
      if (response && response.data) return response.data
      return response
    } catch (error) {
      console.error('❌ Erreur:', error)
      throw error
    }
  },

  async createProperty(data: Partial<Property>): Promise<Property> {
    return api.post('/properties', data)
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    return api.put(`/properties/${id}`, data)
  },

  async deleteProperty(id: string): Promise<void> {
    return api.delete(`/properties/${id}`)
  },

  async togglePublish(id: string): Promise<Property> {
    return api.patch(`/properties/${id}/publish`)
  },
}
