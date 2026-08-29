'use client'

import Link from 'next/link'
import { MapPin, BedDouble, Bath, Ruler, Heart } from 'lucide-react'

interface PropertyCardProps {
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
  images: { url: string; publicId: string }[] | string[] | any[]
  status: string
}

export default function PropertyCard({
  _id,
  title,
  type,
  transactionType,
  price,
  currency,
  city,
  bedrooms,
  bathrooms,
  area,
  images,
  status,
}: PropertyCardProps) {
  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-500/20 text-green-400',
    SOLD: 'bg-red-500/20 text-red-400',
    RENTED: 'bg-yellow-500/20 text-yellow-400',
    UNAVAILABLE: 'bg-gray-500/20 text-gray-400',
  }

  const statusLabels: Record<string, string> = {
    AVAILABLE: 'Disponible',
    SOLD: 'Vendu',
    RENTED: 'Loué',
    UNAVAILABLE: 'Indisponible',
  }

  // 🔥 Fonction robuste pour extraire l'URL de l'image
  const getImageUrl = (): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return '/images/default-property.jpg'
    }

    const firstImage = images[0]

    if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
      return firstImage.url
    }

    if (typeof firstImage === 'string') {
      return firstImage
    }

    return '/images/default-property.jpg'
  }

  const imageUrl = getImageUrl()

  return (
    <div className="group bg-stone-dark rounded-2xl overflow-hidden border border-stone-medium hover:border-bronze transition-all hover:-translate-y-1 h-full">
      <div className="relative h-56 overflow-hidden bg-chocolate-deep">
        {/* 🔥 Utilisation d'une balise <img> standard au lieu de next/image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget
            if (!target.src.endsWith('/images/default-property.jpg')) {
              console.error(`❌ Erreur chargement image: ${imageUrl}`)
              target.src = '/images/default-property.jpg'
            }
          }}
        />
        <button 
          className="absolute top-3 right-3 bg-chocolate-deep/80 p-2 rounded-full hover:bg-chocolate-deep transition-colors"
          aria-label="Favoris"
        >
          <Heart className="w-5 h-5 text-cream-light hover:text-bronze transition-colors" />
        </button>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-chocolate-deep/80 px-3 py-1 rounded-full text-sm text-cream-light">
            {type}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
            {statusLabels[status] || status}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-chocolate-deep/80 px-3 py-1 rounded-full">
          <span className="text-bronze font-bold">
            {transactionType === 'SALE' ? 'Vente' : 'Location'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-cream-light group-hover:text-bronze line-clamp-1">
            {title}
          </h3>
          <p className="text-bronze font-bold text-xl whitespace-nowrap">
            {price.toLocaleString()} {currency}
          </p>
        </div>

        <div className="flex items-center gap-1 text-stone-light text-sm mb-3">
          <MapPin className="w-4 h-4 text-bronze flex-shrink-0" />
          <span className="truncate">{city}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-stone-light border-t border-stone-medium pt-3">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-bronze" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-bronze" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4 text-bronze" />
            <span>{area} m²</span>
          </div>
        </div>

        <Link
          href={`/properties/${_id}`}
          className="mt-4 block w-full text-center bg-chocolate-deep hover:bg-bronze text-cream-light hover:text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          Voir le bien
        </Link>
      </div>
    </div>
  )
}
