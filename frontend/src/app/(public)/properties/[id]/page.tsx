'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Container from '@/components/common/Container'
import WhatsAppButton from '@/components/common/WhatsAppButton'
import { Loader2, MapPin, BedDouble, Bath, Ruler, KeyRound, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Property {
  _id: string
  title: string
  description: string
  type: string
  transactionType: string
  status: string
  price: number
  currency: string
  city: string
  address: string
  bedrooms: number
  bathrooms: number
  area: number
  images: { url: string; publicId: string }[]
  features: string[]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('ID du bien manquant')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${API_URL}/properties/${propertyId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Bien non trouvé')
          }
          throw new Error(`Erreur ${response.status}`)
        }

        const data = await response.json()
        console.log('📥 Détails du bien:', data)

        const propertyData = data.data || data
        setProperty(propertyData)
      } catch (err: any) {
        console.error('❌ Erreur:', err)
        setError(err.message || 'Erreur lors du chargement du bien')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const nextImage = () => {
    if (!property?.images) return
    setSelectedImage((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    if (!property?.images) return
    setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  if (loading) {
    return (
      <Container>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-bronze animate-spin" />
          <p className="mt-4 text-stone-light">Chargement du bien...</p>
        </div>
      </Container>
    )
  }

  if (error || !property) {
    return (
      <Container>
        <div className="py-20 text-center px-4">
          <p className="text-red-400 text-xl">❌ {error || 'Bien non trouvé'}</p>
          <Link href="/properties" className="mt-4 inline-block bg-bronze text-white px-6 py-2 rounded-xl hover:bg-bronze-dark transition-colors">
            Retour à la liste
          </Link>
        </div>
      </Container>
    )
  }

  const transactionLabel = property.transactionType === 'SALE' ? 'Vente' : 'Location'
  const statusLabels: { [key: string]: string } = {
    AVAILABLE: 'Disponible',
    SOLD: 'Vendu',
    RENTED: 'Loué',
    UNAVAILABLE: 'Indisponible',
  }

  // Récupérer toutes les images ou utiliser une image par défaut
  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.url)
    : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=800&h=600&auto=compress&cs=tinysrgb']

  const hasMultipleImages = images.length > 1

  return (
    <Container>
      <div className="py-4 sm:py-8">
        {/* Retour */}
        <Link 
          href="/properties" 
          className="inline-flex items-center gap-2 text-stone-light hover:text-cream-light transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>

        {/* Galerie d'images */}
        <div className="mb-6 sm:mb-8">
          {/* Image principale */}
          <div className="relative h-[280px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-chocolate-deep">
            <img 
              src={images[selectedImage]} 
              alt={`${property.title} - Photo ${selectedImage + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Navigation des images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Miniatures */}
          {hasMultipleImages && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedImage === index ? 'ring-2 ring-bronze' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center px-4">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-bronze transition-colors p-2 z-10"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 text-white hover:text-bronze transition-colors p-1.5 sm:p-2 z-10"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 text-white hover:text-bronze transition-colors p-1.5 sm:p-2 z-10"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12" />
                </button>
              </>
            )}

            <div className="relative w-full max-w-5xl h-[60vh] sm:h-[80vh]">
              <img
                src={images[selectedImage]}
                alt={`${property.title} - Photo ${selectedImage + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-4 sm:bottom-8 text-white text-xs sm:text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Informations du bien */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-stone-dark rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start gap-3 sm:gap-4">
                <div className="w-full sm:w-auto min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-cream-light break-words">{property.title}</h1>
                  <p className="text-stone-light mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span className="break-words">{property.address}, {property.city}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-2xl sm:text-3xl font-bold text-bronze break-words">
                    {property.price.toLocaleString()} {property.currency}
                  </p>
                  <span className="inline-block bg-bronze/20 text-bronze px-3 py-1 rounded-full text-sm mt-1 sm:mt-2">
                    {transactionLabel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-chocolate-deep/50 rounded-xl p-3 sm:p-4 text-center">
                  <BedDouble className="w-5 h-5 text-bronze mx-auto" />
                  <p className="text-cream-light font-semibold mt-1">{property.bedrooms}</p>
                  <p className="text-stone-light text-xs sm:text-sm">Chambres</p>
                </div>
                <div className="bg-chocolate-deep/50 rounded-xl p-3 sm:p-4 text-center">
                  <Bath className="w-5 h-5 text-bronze mx-auto" />
                  <p className="text-cream-light font-semibold mt-1">{property.bathrooms}</p>
                  <p className="text-stone-light text-xs sm:text-sm">Salles de bain</p>
                </div>
                <div className="bg-chocolate-deep/50 rounded-xl p-3 sm:p-4 text-center">
                  <Ruler className="w-5 h-5 text-bronze mx-auto" />
                  <p className="text-cream-light font-semibold mt-1">{property.area}</p>
                  <p className="text-stone-light text-xs sm:text-sm">m²</p>
                </div>
                <div className="bg-chocolate-deep/50 rounded-xl p-3 sm:p-4 text-center">
                  <KeyRound className="w-5 h-5 text-bronze mx-auto" />
                  <p className="text-cream-light font-semibold mt-1">
                    {statusLabels[property.status] || property.status}
                  </p>
                  <p className="text-stone-light text-xs sm:text-sm">Statut</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-cream-light mb-2 sm:mb-3">Description</h2>
                <p className="text-stone-light leading-relaxed text-sm sm:text-base break-words">{property.description}</p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-cream-light mb-2 sm:mb-3">Caractéristiques</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span key={index} className="bg-chocolate-deep px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-cream-light break-words max-w-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-stone-dark rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-cream-light mb-3 sm:mb-4">Demander une visite</h2>
              <form className="space-y-3 sm:space-y-4">
                <input 
                  type="text" 
                  placeholder="Votre nom" 
                  className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm sm:text-base"
                />
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm sm:text-base"
                />
                <input 
                  type="tel" 
                  placeholder="Votre téléphone" 
                  className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm sm:text-base"
                />
                <input 
                  type="date" 
                  className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze text-sm sm:text-base"
                />
                <textarea 
                  placeholder="Message (optionnel)" 
                  rows={3}
                  className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light resize-none text-sm sm:text-base"
                />
                <button 
                  type="submit"
                  className="w-full bg-bronze hover:bg-bronze-dark text-white py-2.5 rounded-xl transition-colors font-medium text-sm sm:text-base"
                >
                  Demander une visite
                </button>
              </form>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-medium">
                <WhatsAppButton 
                  phone="+33123456789"
                  message={`Je suis intéressé par le bien : ${property.title}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}