import mongoose, { Schema, Document } from 'mongoose'

export interface IVisitRequest extends Document {
  organizationId: mongoose.Types.ObjectId
  propertyId: mongoose.Types.ObjectId
  name: string
  phone: string
  email: string
  preferredDate: Date
  message: string
  status: string
  createdAt: Date
}

const VisitRequestSchema = new Schema<IVisitRequest>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'L\'organisation est requise'],
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Le bien est requis'],
    },
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'La date est requise'],
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
)

VisitRequestSchema.index({ organizationId: 1, propertyId: 1 })
VisitRequestSchema.index({ preferredDate: 1 })

export default mongoose.model<IVisitRequest>('VisitRequest', VisitRequestSchema)