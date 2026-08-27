import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import Organization from '../models/Organization'
import User from '../models/User'
import Property from '../models/Property'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('📊 Connected to MongoDB')

    // Vider les collections existantes
    await Organization.deleteMany({})
    await User.deleteMany({})
    await Property.deleteMany({})
    console.log('🧹 Collections vidées')

    // 1. Créer une organisation de démonstration
    const organization = await Organization.create({
      name: 'KEDIMAX IMMOBILIER',
      description: 'Votre partenaire immobilier de confiance depuis 15 ans. Spécialiste de la vente et de la location de biens d\'exception.',
      phone: '+33 1 23 45 67 89',
      email: 'contact@kedimax.com',
      whatsapp: '+33 6 12 34 56 78',
      address: '123 Rue de l\'Immobilier',
      city: 'Paris',
      country: 'France',
      socialMedia: {
        facebook: 'https://facebook.com/kedimax',
        instagram: 'https://instagram.com/kedimax',
        twitter: 'https://twitter.com/kedimax',
        linkedin: 'https://linkedin.com/company/kedimax',
      },
    })
    console.log(`✅ Organisation créée: ${organization.name}`)

    // 2. Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await User.create({
      organizationId: organization._id,
      email: 'admin@kedimax.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    })
    console.log(`✅ Admin créé: ${admin.email} (mot de passe: admin123)`)

    // 3. Créer des biens de démonstration
    const properties = [
      {
        organizationId: organization._id,
        title: 'Appartement moderne avec vue',
        slug: 'appartement-moderne-vue',
        description: 'Magnifique appartement 3 pièces situé au 8e étage avec vue imprenable sur Paris.',
        type: 'APARTMENT',
        transactionType: 'SALE',
        status: 'AVAILABLE',
        price: 450000,
        currency: '€',
        city: 'Paris 8e',
        location: 'Proche Champs-Élysées',
        address: '15 Avenue des Champs-Élysées',
        bedrooms: 3,
        bathrooms: 2,
        area: 85,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            publicId: 'demo/appartement-1',
          },
          {
            url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            publicId: 'demo/appartement-2',
          },
        ],
        features: ['Balcon', 'Ascenseur', 'Parking', 'Cave'],
        published: true,
      },
      {
        organizationId: organization._id,
        title: 'Villa de luxe avec piscine',
        slug: 'villa-luxe-piscine',
        description: 'Superbe villa contemporaine de 180m² avec piscine à débordement.',
        type: 'VILLA',
        transactionType: 'SALE',
        status: 'AVAILABLE',
        price: 850000,
        currency: '€',
        city: 'Boulogne-Billancourt',
        location: 'Quartier résidentiel',
        address: '8 Rue des Lilas',
        bedrooms: 5,
        bathrooms: 3,
        area: 180,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
            publicId: 'demo/villa-1',
          },
          {
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
            publicId: 'demo/villa-2',
          },
        ],
        features: ['Piscine', 'Jardin', 'Garage', 'Domotique'],
        published: true,
      },
      {
        organizationId: organization._id,
        title: 'Studio cosy centre-ville',
        slug: 'studio-cosy-centre-ville',
        description: 'Studio moderne de 25m² entièrement équipé en plein cœur de Paris.',
        type: 'STUDIO',
        transactionType: 'RENT',
        status: 'AVAILABLE',
        price: 750,
        currency: '€',
        city: 'Paris 11e',
        location: 'Quartier Bastille',
        address: '42 Rue de la Roquette',
        bedrooms: 1,
        bathrooms: 1,
        area: 25,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            publicId: 'demo/studio-1',
          },
        ],
        features: ['Meublé', 'Ascenseur', 'Interphone'],
        published: true,
      },
      {
        organizationId: organization._id,
        title: 'Terrain constructible',
        slug: 'terrain-constructible',
        description: 'Magnifique terrain de 800m² constructible en bord de mer.',
        type: 'LAND',
        transactionType: 'SALE',
        status: 'AVAILABLE',
        price: 250000,
        currency: '€',
        city: 'Cannes',
        location: 'Bord de mer',
        address: 'Chemin de la Croisette',
        bedrooms: 0,
        bathrooms: 0,
        area: 800,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
            publicId: 'demo/terrain-1',
          },
        ],
        features: ['Vue mer', 'Constructible', 'Terrain plat'],
        published: true,
      },
      {
        organizationId: organization._id,
        title: 'Maison familiale avec jardin',
        slug: 'maison-familiale-jardin',
        description: 'Charmante maison familiale de 120m² avec grand jardin arboré.',
        type: 'HOUSE',
        transactionType: 'RENT',
        status: 'AVAILABLE',
        price: 1200,
        currency: '€',
        city: 'Versailles',
        location: 'Quartier résidentiel',
        address: '12 Rue de la Paix',
        bedrooms: 4,
        bathrooms: 2,
        area: 120,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
            publicId: 'demo/maison-1',
          },
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            publicId: 'demo/maison-2',
          },
        ],
        features: ['Jardin', 'Garage', 'Cheminée'],
        published: true,
      },
      {
        organizationId: organization._id,
        title: 'Espace commercial premium',
        slug: 'espace-commercial-premium',
        description: 'Espace commercial de 200m² en plein centre-ville.',
        type: 'SHOP',
        transactionType: 'RENT',
        status: 'AVAILABLE',
        price: 2500,
        currency: '€',
        city: 'Lyon',
        location: 'Centre-ville',
        address: '45 Rue de la République',
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            publicId: 'demo/commercial-1',
          },
        ],
        features: ['Vitrine', 'Climatisation', 'Parking à proximité'],
        published: true,
      },
    ]

    for (const propertyData of properties) {
      const property = await Property.create(propertyData)
      console.log(`✅ Bien créé: ${property.title}`)
    }

    console.log('\n🎉 Base de données initialisée avec succès !')
    console.log('📊 Résumé:')
    console.log(`   - Organisation: ${organization.name}`)
    console.log(`   - Admin: admin@kedimax.com / admin123`)
    console.log(`   - Biens: ${properties.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

seedDatabase()
