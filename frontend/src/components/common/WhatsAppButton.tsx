'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phone: string
  message?: string
  className?: string
}

export default function WhatsAppButton({ phone, message = '', className = '' }: WhatsAppButtonProps) {
  const handleClick = () => {
    window.open(`https://wa.me/${phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <button onClick={handleClick} className={`bg-[#25D366] hover:bg-[#1da851] text-white rounded-full flex items-center justify-center gap-2 transition-colors font-medium w-full py-3 px-6 ${className}`}>
      <MessageCircle className="w-5 h-5" /> WhatsApp
    </button>
  )
}
