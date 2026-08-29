'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  setImages: (images: string[]) => void
}

export default function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    } catch (error) {
      console.error('Erreur upload:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index])
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square bg-chocolate-deep rounded-xl overflow-hidden group">
            <Image src={image} alt={`Photo ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-stone-medium rounded-xl p-8 text-center cursor-pointer hover:border-bronze transition-colors">
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        {isUploading ? <div className="flex items-center justify-center gap-2 text-stone-light"><Loader2 className="w-6 h-6 animate-spin" /> Upload en cours...</div> : <div className="text-stone-light"><Upload className="w-8 h-8 mx-auto mb-2" /><p>Cliquez pour ajouter des photos</p><p className="text-sm mt-1">JPG, PNG, WEBP (max 5MB)</p></div>}
      </div>
    </div>
  )
}
