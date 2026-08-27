import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import Organization from '../models/Organization'
import bcrypt from 'bcryptjs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Trouver une organisation
    const org = await Organization.findOne()
    if (!org) {
      console.log('❌ Aucune organisation trouvée!')
      console.log('Veuillez d\'abord créer une organisation avec le script seed')
      process.exit(1)
    }

    console.log('✅ Organisation trouvée:', org.name)

    // Supprimer l'ancien admin s'il existe
    const deleted = await User.deleteMany({ email: 'admin@kedimax.com' })
    console.log(`🗑️ ${deleted.deletedCount} admin(s) supprimé(s)`)

    // Créer un nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = new User({
      organizationId: org._id,
      email: 'admin@kedimax.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    })

    await admin.save()
    console.log('\n✅ Admin créé avec succès!')
    console.log('📧 Email: admin@kedimax.com')
    console.log('🔑 Mot de passe: admin123')
    console.log('🏢 Organisation:', org.name)

    // Vérifier que l'admin est bien créé
    const check = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
    if (check) {
      console.log('\n✅ Vérification: Admin trouvé dans la base de données')
      const isMatch = await check.comparePassword('admin123')
      console.log(`🔑 Le mot de passe "admin123" est ${isMatch ? '✅ correct' : '❌ incorrect'}`)
    }

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

createAdmin()
