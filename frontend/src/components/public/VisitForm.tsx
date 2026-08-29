'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Send, Loader2 } from 'lucide-react'

const visitSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  phone: z.string().min(10, 'Le téléphone est requis'),
  email: z.string().email('Email invalide'),
  preferredDate: z.string().min(1, 'La date est requise'),
  message: z.string().optional(),
})

type VisitFormData = z.infer<typeof visitSchema>

interface VisitFormProps {
  propertyId?: string
}

export default function VisitForm({ propertyId }: VisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
  })

  const onSubmit = async (data: VisitFormData) => {
    setIsSubmitting(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/contact/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, propertyId, preferredDate: new Date(data.preferredDate).toISOString() }),
      })
      
      if (!response.ok) throw new Error('Erreur lors de l\'envoi')
      
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-stone-light mb-1">Nom complet *</label>
        <input type="text" {...register('name')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm" placeholder="Jean Dupont" />
        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Téléphone *</label>
        <input type="tel" {...register('phone')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm" placeholder="01 23 45 67 89" />
        {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Email *</label>
        <input type="email" {...register('email')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light text-sm" placeholder="jean.dupont@email.com" />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Date souhaitée *</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
          <input type="date" {...register('preferredDate')} className="w-full bg-chocolate-deep text-cream-light rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze text-sm" min={new Date().toISOString().split('T')[0]} />
        </div>
        {errors.preferredDate && <p className="text-red-400 text-xs">{errors.preferredDate.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Message (optionnel)</label>
        <textarea {...register('message')} rows={3} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light resize-none text-sm" placeholder="Informations complémentaires..." />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-bronze hover:bg-bronze-dark text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50">
        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</> : <><Send className="w-4 h-4" /> Demander une visite</>}
      </button>
      {success && <div className="bg-green-500/20 text-green-400 p-3 rounded-xl text-center text-sm">✅ Demande envoyée !</div>}
    </form>
  )
}
