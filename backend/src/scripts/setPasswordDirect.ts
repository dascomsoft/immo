import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import bcrypt from 'bcryptjs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const setPasswordDirect = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Trouver l'utilisateur
    const admin = await User.findOne({ email: 'admin@kedimax.com' })
    
    if (!admin) {
      console.log('❌ Admin non trouvé!')
      console.log('Création d\'un nouvel admin...')
      
      // Créer un nouvel admin
      const Organization = require('../models/Organization').default
      const org = await Organization.findOne()
      if (!org) {
        console.log('❌ Aucune organisation trouvée!')
        process.exit(1)
      }
      
      const newAdmin = new User({
        organizationId: org._id,
        email: 'admin@kedimax.com',
        password: 'admin123',
        name: 'Administrateur',
        role: 'ADMIN',
      })
      
      await newAdmin.save()
      console.log('✅ Nouvel admin créé')
      
      // Vérifier
      const check = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
      if (check) {
        console.log('🔍 Test du mot de passe...')
        const isMatch = await bcrypt.compare('admin123', check.password)
        console.log(`   Résultat: ${isMatch ? '✅ OK' : '❌ KO'}`)
      }
      
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log('✅ Admin trouvé:', admin.email)

    // Définir le mot de passe directement avec bcrypt
    const plainPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    
    // Mettre à jour sans passer par le middleware
    await User.updateOne(
      { email: 'admin@kedimax.com' },
      { $set: { password: hashedPassword } }
    )
    
    console.log('✅ Mot de passe mis à jour directement')

    // Vérifier que le mot de passe fonctionne
    const check = await User.findOne({ email: 'admin@kedimax.com' }).select('+password')
    if (check) {
      console.log('\n🔍 Test de vérification...')
      const isMatch = await bcrypt.compare(plainPassword, check.password)
      console.log(`   Mot de passe "admin123": ${isMatch ? '✅ Correct' : '❌ Incorrect'}`)
      
      if (isMatch) {
        console.log('\n🎉 Le mot de passe est correct !')
        console.log('📧 Email: admin@kedimax.com')
        console.log('🔑 Mot de passe: admin123')
      } else {
        console.log('\n❌ Le mot de passe est toujours incorrect')
        console.log('Hash stocké:', check.password)
      }
    }

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

setPasswordDirect()
