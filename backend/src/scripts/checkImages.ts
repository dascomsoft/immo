import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Property from '../models/Property'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const checkImages = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Récupérer tous les biens avec leurs images
    const properties = await Property.find({})
    
    console.log(`📋 ${properties.length} biens trouvés:\n`)
    
    properties.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`)
      console.log(`   Images: ${p.images ? p.images.length : 0}`)
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, idx) => {
          console.log(`   - Image ${idx + 1}: ${img.url}`)
        })
      }
      console.log('')
    })

    await mongoose.disconnect()
    console.log('✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

checkImages()
