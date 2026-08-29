'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  phone: z.string().min(10, 'Le téléphone est requis'),
  email: z.string().email('Email invalide'),
  requestType: z.string().min(1, 'Veuillez sélectionner un type'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone-light mb-1">Nom complet *</label>
          <input type="text" {...register('name')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light" placeholder="Jean Dupont" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-stone-light mb-1">Téléphone *</label>
          <input type="tel" {...register('phone')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light" placeholder="01 23 45 67 89" />
          {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Email *</label>
        <input type="email" {...register('email')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light" placeholder="jean.dupont@email.com" />
        {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Type de demande *</label>
        <select {...register('requestType')} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze">
          <option value="">Sélectionnez un type</option>
          <option value="INFORMATION">Demande d'information</option>
          <option value="VISIT">Demande de visite</option>
          <option value="RENT">Location</option>
          <option value="BUY">Achat</option>
          <option value="OTHER">Autre</option>
        </select>
        {errors.requestType && <p className="text-red-400 text-sm">{errors.requestType.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-stone-light mb-1">Message *</label>
        <textarea {...register('message')} rows={4} className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light resize-none" placeholder="Décrivez votre projet ou votre demande..." />
        {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-bronze hover:bg-bronze-dark text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</> : <><Send className="w-5 h-5" /> Envoyer ma demande</>}
      </button>
      {success && <div className="bg-green-500/20 text-green-400 p-4 rounded-xl text-center">✅ Votre message a été envoyé avec succès !</div>}
    </form>
  )
}
