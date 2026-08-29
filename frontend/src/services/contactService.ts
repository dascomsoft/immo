import { api } from './api'
import { ContactRequest, VisitRequest } from '@/types'

export const contactService = {
  async sendContact(data: Partial<ContactRequest>): Promise<ContactRequest> {
    return api.post('/contact', data)
  },

  async sendVisit(data: Partial<VisitRequest>): Promise<VisitRequest> {
    return api.post('/contact/visits', data)
  },

  async getRequests(): Promise<{ data: ContactRequest[] }> {
    return api.get('/contact')
  },

  async getVisits(): Promise<{ data: VisitRequest[] }> {
    return api.get('/contact/visits')
  },

  async updateRequestStatus(id: string, status: string): Promise<ContactRequest> {
    return api.patch(`/contact/${id}/status`, { status })
  },

  async updateVisitStatus(id: string, status: string): Promise<VisitRequest> {
    return api.patch(`/contact/visits/${id}/status`, { status })
  },
}
