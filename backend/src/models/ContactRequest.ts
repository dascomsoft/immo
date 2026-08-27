import mongoose, { Schema, Document } from 'mongoose'

export interface IContactRequest extends Document {
  organizationId: mongoose.Types.ObjectId
  name: string
  phone: string
  email: string
  requestType: string
  propertyId?: mongoose.Types.ObjectId
  message: string
  status: string
  createdAt: Date
}

const ContactRequestSchema = new Schema<IContactRequest>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'L\'organisation est requise'],
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
    requestType: {
      type: String,
      enum: ['INFORMATION', 'VISIT', 'RENT', 'BUY', 'OTHER'],
      required: [true, 'Le type de demande est requis'],
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    message: {
      type: String,
      required: [true, 'Le message est requis'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
)

ContactRequestSchema.index({ organizationId: 1, createdAt: -1 })
ContactRequestSchema.index({ propertyId: 1 })

export default mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema)