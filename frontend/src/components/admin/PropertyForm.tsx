'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploader from './ImageUploader'
import { Save, Loader2 } from 'lucide-react'

const propertySchema = z.object({
  title: z.string().min(3, 'Le titre est requis'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  type: z.string().min(1, 'Le type est requis'),
  transactionType: z.string().min(1, 'Le type de transaction est requis'),
  price: z.coerce.number().min(1, 'Le prix est requis'),
  currency: z.string().default('€'),
  city: z.string().min(2, 'La ville est requise'),
  address: z.string().min(5, 'L\'adresse est requise'),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(1, 'La superficie est requise'),
  features: z.string().optional(),
  status: z.string().default('AVAILABLE'),
  published: z.boolean().default(true),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  propertyId?: string
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      currency: '€',
      status: 'AVAILABLE',
      published: true,
    },
  })

  // Fonction pour convertir les URLs blob en fichiers
  const convertBlobToFiles = async (urls: string[]): Promise<File[]> => {
    const files: File[] = []
    for (const url of urls) {
      try {
        const response = await fetch(url)
        const blob = await response.blob()
        const extension = blob.type.split('/')[1] || 'jpg'
        const file = new File([blob], `image-${Date.now()}.${extension}`, { type: blob.type })
        files.push(file)
      } catch (error) {
        console.error('Erreur conversion:', error)
      }
    }
    return files
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Veuillez vous connecter')
        return
      }

      // Créer FormData
      const formData = new FormData()
      
      // Ajouter tous les champs textuels
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('transactionType', data.transactionType)
      formData.append('price', String(data.price))
      formData.append('currency', data.currency || '€')
      formData.append('city', data.city)
      formData.append('address', data.address)
      formData.append('bedrooms', String(data.bedrooms || 0))
      formData.append('bathrooms', String(data.bathrooms || 0))
      formData.append('area', String(data.area))
      formData.append('features', data.features || '')
      formData.append('status', data.status || 'AVAILABLE')
      formData.append('published', String(data.published))

      // Ajouter les images
      const files = await convertBlobToFiles(imageUrls)
      console.log(`📸 ${files.length} images à uploader`)
      
      for (const file of files) {
        formData.append('images', file)
      }

      // Debug: Afficher le contenu du FormData
      console.log('📤 Envoi du FormData...')
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`   ${key}: ${value}`)
        }
      }

      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()
      console.log('📥 Réponse:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'ajout')
      }

      setSuccess(true)
      setImageUrls([])
      setImageFiles([])
      reset()

      setTimeout(() => {
        window.location.href = '/admin/properties'
      }, 2000)
    } catch (err: any) {
      console.error('❌ Erreur:', err)
      setError(err.message || 'Erreur lors de l\'ajout du bien')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-center">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 text-green-400 p-4 rounded-xl text-center">
          ✅ Bien ajouté avec succès ! Redirection en cours...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone-light mb-1">Titre *</label>
          <input
            type="text"
            {...register('title')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="Titre du bien"
          />
          {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Prix *</label>
          <input
            type="number"
            {...register('price')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="450000"
          />
          {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Type de bien *</label>
          <select
            {...register('type')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Sélectionnez</option>
            <option value="ROOM">Chambre</option>
            <option value="STUDIO">Studio</option>
            <option value="APARTMENT">Appartement</option>
            <option value="HOUSE">Maison</option>
            <option value="VILLA">Villa</option>
            <option value="DUPLEX">Duplex</option>
            <option value="LAND">Terrain</option>
            <option value="OFFICE">Bureau</option>
            <option value="SHOP">Commerce</option>
            <option value="BUILDING">Immeuble</option>
            <option value="OTHER">Autre</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Type de transaction *</label>
          <select
            {...register('transactionType')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Sélectionnez</option>
            <option value="SALE">Vente</option>
            <option value="RENT">Location</option>
          </select>
          {errors.transactionType && <p className="text-red-400 text-sm">{errors.transactionType.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Ville *</label>
          <input
            type="text"
            {...register('city')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="Paris"
          />
          {errors.city && <p className="text-red-400 text-sm">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Adresse *</label>
          <input
            type="text"
            {...register('address')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="123 Rue de Paris"
          />
          {errors.address && <p className="text-red-400 text-sm">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Chambres</label>
          <input
            type="number"
            {...register('bedrooms')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="3"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Salles de bain</label>
          <input
            type="number"
            {...register('bathrooms')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-light mb-1">Superficie (m²) *</label>
          <input
            type="number"
            {...register('area')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="85"
          />
          {errors.area && <p className="text-red-400 text-sm">{errors.area.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-stone-light mb-1">Description *</label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light resize-none"
            placeholder="Description détaillée du bien..."
          />
          {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-stone-light mb-1">Photos</label>
          <ImageUploader images={imageUrls} setImages={setImageUrls} />
          <p className="text-xs text-stone-light mt-1">
            {imageUrls.length} image(s) sélectionnée(s)
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-stone-light mb-1">Caractéristiques</label>
          <input
            type="text"
            {...register('features')}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
            placeholder="Balcon, Ascenseur, Parking, Cave (séparés par des virgules)"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bronze hover:bg-bronze-dark text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enregistrement en cours...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            {propertyId ? 'Modifier le bien' : 'Ajouter le bien'}
          </>
        )}
      </button>
    </form>
  )
}
