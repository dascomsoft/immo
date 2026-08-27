import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Property from '../models/Property'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const listProperties = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    const properties = await Property.find({})
      .sort({ createdAt: -1 })
      .lean()

    console.log(`📋 ${properties.length} biens trouvés:\n`)

    properties.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`)
      console.log(`   - Prix: ${p.price} ${p.currency}`)
      console.log(`   - Ville: ${p.city}`)
      console.log(`   - Type: ${p.type}`)
      console.log(`   - Status: ${p.status}`)
      console.log(`   - Publié: ${p.published ? '✅ Oui' : '❌ Non'}`)
      console.log(`   - ID: ${p._id}\n`)
    })

    const publishedCount = properties.filter(p => p.published).length
    console.log(`📊 Biens publiés: ${publishedCount}/${properties.length}`)

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

listProperties()
