import mongoose, { Schema, Document } from 'mongoose'

export interface IOrganization extends Document {
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

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
    },
    city: {
      type: String,
      required: [true, 'La ville est requise'],
    },
    country: {
      type: String,
      default: 'France',
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IOrganization>('Organization', OrganizationSchema)