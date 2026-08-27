import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  organizationId: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  role: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'L\'organisation est requise'],
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'AGENT', 'VIEWER'],
      default: 'VIEWER',
    },
  },
  {
    timestamps: true,
  }
)

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    console.log('🔍 Comparaison de mot de passe...')
    console.log('   Candidate:', candidatePassword)
    console.log('   Stored hash:', this.password ? 'Présent' : 'Absent')
    
    if (!this.password) {
      console.log('❌ Pas de mot de passe stocké')
      return false
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log(`   Résultat: ${isMatch ? '✅ Correspond' : '❌ Ne correspond pas'}`)
    return isMatch
  } catch (error) {
    console.error('❌ Erreur lors de la comparaison:', error)
    return false
  }
}

export default mongoose.model<IUser>('User', UserSchema)
