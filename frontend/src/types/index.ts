export interface PropertyImage {
  url: string
  publicId: string
}

export interface Property {
  _id: string
  organizationId: string
  title: string
  slug: string
  description: string
  type: string
  transactionType: string
  status: string
  price: number
  currency: string
  city: string
  location: string
  address: string
  bedrooms: number
  bathrooms: number
  area: number
  images: PropertyImage[]
  features: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyFilters {
  type?: string
  transactionType?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  status?: string
  published?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ContactRequest {
  _id: string
  organizationId: string
  name: string
  phone: string
  email: string
  requestType: string
  propertyId?: string
  property?: Property
  message: string
  status: string
  createdAt: Date
}

export interface VisitRequest {
  _id: string
  organizationId: string
  propertyId: string
  name: string
  phone: string
  email: string
  preferredDate: Date
  message: string
  status: string
  createdAt: Date
}

export interface User {
  _id: string
  organizationId: string
  email: string
  name: string
  role: string
  createdAt: Date
}

export interface Organization {
  _id: string
  name: string
  logo: string
  description: string
  phone: string
  email: string
  whatsapp: string
  address: string
  city: string
  country: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  createdAt: Date
  updatedAt: Date
}
