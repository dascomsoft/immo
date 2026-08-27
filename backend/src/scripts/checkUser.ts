import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import bcrypt from 'bcryptjs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const checkUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Vérifier les utilisateurs
    const users = await User.find({})
    console.log(`📋 Utilisateurs trouvés: ${users.length}`)
    
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (${user.name}) - Role: ${user.role}`)
      console.log(`   Password hash: ${user.password.substring(0, 20)}...`)
    })

    // Tester le login manuellement
    if (users.length > 0) {
      const admin = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
      if (admin) {
        console.log('\n🔍 Test de login pour admin@kedimax.com')
        
        // Vérifier si le mot de passe "admin123" est correct
        const testPassword = 'admin123'
        const isMatch = await admin.comparePassword(testPassword)
        console.log(`   Mot de passe "admin123": ${isMatch ? '✅ Correct' : '❌ Incorrect'}`)
        
        // Créer un nouvel utilisateur si nécessaire
        if (!isMatch) {
          console.log('🔄 Réinitialisation du mot de passe...')
          admin.password = 'admin123'
          await admin.save()
          console.log('✅ Mot de passe réinitialisé à "admin123"')
        }
      }
    } else {
      console.log('⚠️ Aucun utilisateur trouvé!')
    }

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

checkUser()
