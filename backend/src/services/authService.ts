import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

class AuthService {
  generateToken(user: IUser): string {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      organizationId: user.organizationId.toString(),
      role: user.role,
    }
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any)
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw new Error('Token invalide ou expiré')
    }
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    console.log('🔍 Recherche de l\'utilisateur:', email)
    
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email)
      throw new Error('Email ou mot de passe incorrect')
    }

    console.log('✅ Utilisateur trouvé:', user.email)
    console.log('�� Vérification du mot de passe...')

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect')
      throw new Error('Email ou mot de passe incorrect')
    }

    console.log('✅ Mot de passe correct')

    const userObject = user.toObject() as IUser
    const token = this.generateToken(userObject)

    console.log('✅ Token généré')

    return {
      user: userObject,
      token,
    }
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const user = new User(data)
    await user.save()

    return user.toObject() as IUser
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).select('-password')
    if (!user) return null
    return user.toObject() as IUser
  }

  async getUsersByOrganization(organizationId: string): Promise<IUser[]> {
    const users = await User.find({ organizationId }).select('-password')
    return users.map(user => user.toObject() as IUser)
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    if (data.password) {
      const user = await User.findById(id)
      if (user) {
        user.password = data.password
        await user.save()
        const updatedUser = await User.findById(id).select('-password')
        if (!updatedUser) return null
        return updatedUser.toObject() as IUser
      }
      return null
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password')
    if (!user) return null
    return user.toObject() as IUser
  }

  async deleteUser(id: string): Promise<void> {
    await User.findByIdAndDelete(id)
  }
}

export default new AuthService()
