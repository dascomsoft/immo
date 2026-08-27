import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import bcrypt from 'bcryptjs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const resetPassword = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Chercher l'utilisateur admin
    const admin = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
    
    if (!admin) {
      console.log('❌ Admin non trouvé!')
      process.exit(1)
    }

    console.log('✅ Admin trouvé:', admin.email)
    console.log('🔄 Réinitialisation du mot de passe...')

    // Réinitialiser le mot de passe
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    admin.password = hashedPassword
    await admin.save()

    console.log('✅ Mot de passe réinitialisé avec succès!')
    console.log(`📧 Email: admin@kedimax.com`)
    console.log(`🔑 Nouveau mot de passe: ${newPassword}`)

    // Vérifier que le mot de passe fonctionne
    const check = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
    if (check) {
      const isMatch = await check.comparePassword(newPassword)
      console.log(`🔍 Vérification: ${isMatch ? '✅ Mot de passe valide' : '❌ Mot de passe invalide'}`)
    }

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

resetPassword()
