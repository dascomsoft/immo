'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Section from '@/components/common/Section'
import PropertyCard from './PropertyCard'

interface Property {
  _id: string
  title: string
  type: string
  transactionType: string
  price: number
  currency: string
  city: string
  bedrooms: number
  bathrooms: number
  area: number
  images: { url: string; publicId: string }[]
  status: string
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${API_URL}/properties?limit=6`)
        const data = await response.json()
        console.log('📥 Featured biens récupérés:', data)

        let propertiesData = data.data || []
        setProperties(propertiesData)
      } catch (error) {
        console.error('❌ Erreur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  if (loading) {
    return (
      <Section title="Nos biens disponibles" subtitle="Découvrez notre sélection de biens d'exception" background="stone">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-stone-dark rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </Section>
    )
  }

  if (properties.length === 0) {
    return (
      <Section title="Nos biens disponibles" subtitle="Découvrez notre sélection de biens d'exception" background="stone">
        <div className="text-center py-12">
          <p className="text-stone-light">Aucun bien disponible pour le moment</p>
        </div>
      </Section>
    )
  }

  return (
    <Section title="Nos biens disponibles" subtitle="Découvrez notre sélection de biens d'exception" background="stone">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(0, 6).map((property) => (
          // ❌ SUPPRIMÉ : <div key={property._id} data-aos="fade-up">
          // ✅ key directement sur PropertyCard, pas de wrapper AOS
          <PropertyCard key={property._id} {...property} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-bronze hover:text-bronze-light transition-colors font-semibold"
        >
          Voir tous nos biens
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </Section>
  )
}