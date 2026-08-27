import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  organizationId: mongoose.Types.ObjectId
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
  images: {
    url: string
    publicId: string
  }[]
  features: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'L\'organisation est requise'],
    },
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
    },
    type: {
      type: String,
      enum: ['ROOM', 'STUDIO', 'APARTMENT', 'HOUSE', 'VILLA', 'DUPLEX', 'LAND', 'OFFICE', 'SHOP', 'BUILDING', 'OTHER'],
      required: [true, 'Le type est requis'],
    },
    transactionType: {
      type: String,
      enum: ['SALE', 'RENT'],
      required: [true, 'Le type de transaction est requis'],
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'SOLD', 'RENTED', 'UNAVAILABLE'],
      default: 'AVAILABLE',
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: 0,
    },
    currency: {
      type: String,
      default: '€',
    },
    city: {
      type: String,
      required: [true, 'La ville est requise'],
    },
    location: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    area: {
      type: Number,
      required: [true, 'La superficie est requise'],
      min: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    features: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index pour les recherches
PropertySchema.index({ title: 'text', description: 'text', city: 'text' })
PropertySchema.index({ organizationId: 1, slug: 1 }, { unique: true })
PropertySchema.index({ transactionType: 1, status: 1 })

export default mongoose.model<IProperty>('Property', PropertySchema)