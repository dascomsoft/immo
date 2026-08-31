'use client'

import Link from 'next/link'
import { MapPin, BedDouble, Bath, Ruler, Heart } from 'lucide-react'
import { useState } from 'react'

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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

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

  /**
   * Récupère proprement la première image.
   */
  const getImageUrl = (): string | null => {
    if (!Array.isArray(images) || images.length === 0) {
      return null
    }

    const firstImage = images[0]

    // Format MongoDB:
    // { url: "...", publicId: "..." }
    if (
      typeof firstImage === 'object' &&
      firstImage !== null &&
      typeof firstImage.url === 'string' &&
      firstImage.url.trim() !== ''
    ) {
      return firstImage.url.trim()
    }

    // Format:
    // ["https://..."]
    if (
      typeof firstImage === 'string' &&
      firstImage.trim() !== ''
    ) {
      return firstImage.trim()
    }

    return null
  }

  const imageUrl = getImageUrl()

  /**
   * Debug uniquement en développement.
   */
  if (process.env.NODE_ENV === 'development') {
    console.log('🏠 Property:', title)
    console.log('🖼️ Images:', images)
    console.log('🔗 Image URL:', imageUrl)
  }

  const handleImageError = () => {
    console.error(`❌ Image impossible à charger pour "${title}"`)
    console.error('🔗 URL:', imageUrl)

    setImageError(true)
    setImageLoading(false)
  }

  return (
    <div className="group bg-stone-dark rounded-2xl overflow-hidden border border-stone-medium hover:border-bronze transition-all hover:-translate-y-1 h-full">

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden bg-chocolate-deep">

        {/* Loader */}
        {imageLoading && imageUrl && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-chocolate-deep z-0">
            <div className="w-8 h-8 border-4 border-stone-medium border-t-bronze rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className={`relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              console.log(`✅ Image chargée: ${title}`)
              setImageLoading(false)
            }}
            onError={handleImageError}
          />
        ) : (
          /* Fallback sans fichier externe */
          <div className="absolute inset-0 flex items-center justify-center bg-chocolate-deep">
            <div className="text-center text-cream-light">
              <div className="text-5xl mb-2">
                🏠
              </div>

              <p className="text-sm opacity-70">
                Image non disponible
              </p>
            </div>
          </div>
        )}

        {/* Favoris */}
        <button
          type="button"
          className="absolute top-3 right-3 bg-chocolate-deep/80 p-2 rounded-full hover:bg-chocolate-deep transition-colors z-10"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="w-5 h-5 text-cream-light hover:text-bronze transition-colors" />
        </button>

        {/* Type + statut */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="bg-chocolate-deep/80 px-3 py-1 rounded-full text-sm text-cream-light">
            {type}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm ${
              statusColors[status] ||
              'bg-gray-500/20 text-gray-400'
            }`}
          >
            {statusLabels[status] || status}
          </span>
        </div>

        {/* Vente / Location */}
        <div className="absolute bottom-3 right-3 bg-chocolate-deep/80 px-3 py-1 rounded-full z-10">
          <span className="text-bronze font-bold">
            {transactionType === 'SALE'
              ? 'Vente'
              : 'Location'}
          </span>
        </div>
      </div>

      {/* INFORMATIONS */}
      <div className="p-5">

        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-lg font-semibold text-cream-light group-hover:text-bronze line-clamp-1">
            {title}
          </h3>

          <p className="text-bronze font-bold text-xl whitespace-nowrap">
            {price.toLocaleString()} {currency}
          </p>
        </div>

        {/* Ville */}
        <div className="flex items-center gap-1 text-stone-light text-sm mb-3">
          <MapPin className="w-4 h-4 text-bronze flex-shrink-0" />

          <span className="truncate">
            {city}
          </span>
        </div>

        {/* Caractéristiques */}
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

        {/* Bouton */}
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