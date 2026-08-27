import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Organization from '../models/Organization'
import Property from '../models/Property'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const checkOrg = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB\n')

    // Vérifier les organisations
    const orgs = await Organization.find({})
    console.log(`📋 Organisations trouvées: ${orgs.length}`)
    orgs.forEach((org, i) => {
      console.log(`${i + 1}. ${org.name} (ID: ${org._id})`)
    })

    if (orgs.length === 0) {
      console.log('⚠️ Aucune organisation trouvée!')
      process.exit(1)
    }

    // Utiliser la première organisation
    const orgId = orgs[0]._id
    console.log(`\n🔍 Utilisation de l'organisation: ${orgs[0].name}`)
    console.log(`   ID: ${orgId}`)

    // Vérifier les biens pour cette organisation
    const properties = await Property.find({ organizationId: orgId })
    console.log(`\n📋 Biens trouvés: ${properties.length}`)
    
    if (properties.length === 0) {
      console.log('⚠️ Aucun bien pour cette organisation!')
      
      // Vérifier tous les biens
      const allProps = await Property.find({})
      console.log(`\n📊 Total des biens dans la base: ${allProps.length}`)
      if (allProps.length > 0) {
        console.log('   Organisation IDs des biens:')
        allProps.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.title} -> org: ${p.organizationId}`)
        })
      }
    } else {
      properties.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} (${p.city}) - ${p.price} €`)
      })
    }

    await mongoose.disconnect()
    console.log('\n✅ Déconnecté')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

checkOrg()
