'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Overlay pour fermer en cliquant à l'extérieur */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className={`bg-stone-dark rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl mx-4`}>
        {/* Header */}
        <div className="sticky top-0 bg-stone-dark rounded-t-2xl p-4 md:p-6 border-b border-stone-medium flex items-center justify-between z-20">
          <h2 className="text-lg md:text-xl font-bold text-cream-light">{title}</h2>
          <button
            onClick={onClose}
            className="text-stone-light hover:text-cream-light transition-colors p-2 hover:bg-chocolate-deep/50 rounded-xl"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        
        {/* Contenu */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
