'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface PropertyGalleryProps {
  images: string[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const displayImages = images.length > 0 ? images : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=1200&h=800&auto=compress&cs=tinysrgb']

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % displayImages.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 lg:col-span-2 relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
          <Image src={displayImages[selectedImage]} alt="Bien immobilier" fill className="object-cover cursor-pointer" onClick={() => setIsLightboxOpen(true)} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          {displayImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-chocolate-deep/80 p-2 rounded-full hover:bg-chocolate-deep"><ChevronLeft className="w-6 h-6 text-cream-light" /></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-chocolate-deep/80 p-2 rounded-full hover:bg-chocolate-deep"><ChevronRight className="w-6 h-6 text-cream-light" /></button>
            </>
          )}
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-4 lg:col-span-2">
          {displayImages.slice(0, 4).map((img, index) => (
            <div key={index} className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer ${index === selectedImage ? 'ring-2 ring-bronze' : ''}`} onClick={() => setSelectedImage(index)}>
              <Image src={img} alt={`Photo ${index + 1}`} fill className="object-cover hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 text-white hover:text-bronze"><X className="w-8 h-8" /></button>
          <button onClick={prevImage} className="absolute left-4 text-white hover:text-bronze"><ChevronLeft className="w-12 h-12" /></button>
          <button onClick={nextImage} className="absolute right-4 text-white hover:text-bronze"><ChevronRight className="w-12 h-12" /></button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image src={displayImages[selectedImage]} alt="Bien immobilier" fill className="object-contain" sizes="100vw" />
          </div>
          <div className="absolute bottom-8 text-white text-sm">{selectedImage + 1} / {displayImages.length}</div>
        </div>
      )}
    </>
  )
}
