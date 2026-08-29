import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 bg-stone-dark border-t border-stone-medium">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-cream-light mb-4">
          Prêt à réaliser votre projet immobilier ?
        </h2>
        <p className="text-lg text-stone-light mb-8">
          Contactez-nous dès maintenant pour un accompagnement personnalisé.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="bg-bronze hover:bg-bronze-dark text-white px-8 py-4 rounded-full flex items-center gap-2 transition-colors font-semibold"
          >
            Nous contacter <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/properties"
            className="border border-stone-medium hover:border-bronze text-cream-light px-8 py-4 rounded-full flex items-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5" /> Voir nos biens
          </Link>
        </div>
      </div>
    </section>
  )
}
