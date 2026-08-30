'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import SearchBar from '@/components/common/SearchBar'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-chocolate-deep">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/immo.webp')",
        }}
      />
      
      {/* Overlay pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-chocolate-deep/80 via-chocolate-deep/60 to-chocolate-deep" />
      
      <div className="container mx-auto px-4 relative z-10 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-cream-light leading-tight mb-6">
            Votre projet immobilier,<br />
            <span className="text-bronze">notre priorité.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10">
            Découvrez des biens adaptés à vos besoins et bénéficiez d'un accompagnement professionnel.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/properties" 
              className="bg-bronze hover:bg-bronze-dark text-white px-8 py-4 rounded-full flex items-center gap-2 transition-colors font-semibold"
            >
              Découvrir nos biens <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="border border-stone-medium hover:border-bronze text-cream-light px-8 py-4 rounded-full flex items-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" /> Nous contacter
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  )
}
