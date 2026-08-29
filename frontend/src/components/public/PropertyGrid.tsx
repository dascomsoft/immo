'use client'

import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard'
import EmptyState from '@/components/admin/EmptyState'

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

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${API_URL}/properties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📥 Biens récupérés:', data)
        
        // Gérer différents formats de réponse
        let propertiesData = []
        if (data.data && Array.isArray(data.data)) {
          propertiesData = data.data
        } else if (Array.isArray(data)) {
          propertiesData = data
        }
        
        setProperties(propertiesData)
      } catch (err: any) {
        console.error('❌ Erreur de chargement:', err)
        setError(err.message || 'Erreur lors du chargement des biens')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-stone-dark rounded-2xl h-80 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">❌ {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-bronze text-white px-6 py-2 rounded-xl"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState 
        title="Aucun bien disponible"
        description="Aucun bien ne correspond à vos critères de recherche."
        icon="home"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property._id} data-aos="fade-up">
          <PropertyCard {...property} />
        </div>
      ))}
    </div>
  )
}
