export interface Organization {
  _id: string;
  name: string;
  logo: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Property {
  _id: string;
  organizationId: string;
  title: string;
  slug: string;
  description: string;
  type: 'ROOM' | 'STUDIO' | 'APARTMENT' | 'HOUSE' | 'VILLA' | 'DUPLEX' | 'LAND' | 'OFFICE' | 'SHOP' | 'BUILDING' | 'OTHER';
  transactionType: 'SALE' | 'RENT';
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'UNAVAILABLE';
  price: number;
  currency: string;
  city: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: {
    url: string;
    publicId: string;
  }[];
  features: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactRequest {
  _id: string;
  organizationId: string;
  name: string;
  phone: string;
  email: string;
  requestType: 'INFORMATION' | 'VISIT' | 'RENT' | 'BUY' | 'OTHER';
  propertyId?: string;
  property?: Property;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
}

export interface VisitRequest {
  _id: string;
  organizationId: string;
  propertyId: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: Date;
  message: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
}

export interface User {
  _id: string;
  organizationId: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'VIEWER';
  createdAt: Date;
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  pendingRequests: number;
  visitRequests: number;
  recentProperties: Property[];
  recentRequests: ContactRequest[];
}