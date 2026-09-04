import ContactForm from '@/components/public/ContactForm'
import Container from '@/components/common/Container'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      {/* ─── HEADER AVEC BACKGROUND IMAGE ─── */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80")',
        }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-chocolate-deep" />

        {/* Contenu du header */}
        <div className="relative z-10">
          <Container>
            <div className="py-16 sm:py-20 md:py-24 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-light drop-shadow-lg">
                Contactez-nous
              </h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white max-w-2xl mx-auto drop-shadow-md">
                Nous sommes à votre disposition pour répondre à toutes vos questions
              </p>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2">
            <div className="bg-stone-dark rounded-2xl p-6 sm:p-8 border border-stone-medium">
              <h2 className="text-xl sm:text-2xl font-bold text-cream-light mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-stone-dark rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 border border-stone-medium">
              <h3 className="text-lg sm:text-xl font-semibold text-white
               mb-6">Nos coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-bronze mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-light text-sm">Téléphone</p>
                    <p className="text-cream-light">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-bronze mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-light text-sm">Email</p>
                    <p className="text-cream-light">contact@agence.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-bronze mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-light text-sm">WhatsApp</p>
                    <p className="text-cream-light">+33 6 12 34 56 78</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-bronze mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-light text-sm">Adresse</p>
                    <p className="text-cream-light">123 Rue de l'Immobilier<br />75000 Paris</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-bronze mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-light text-sm">Horaires</p>
                    <p className="text-cream-light">Lun-Ven: 9h-19h<br />Sam: 10h-17h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}