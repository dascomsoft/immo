import ContactForm from '@/components/public/ContactForm'
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/common/Container'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <PageHeader 
        title="Contactez-nous"
        subtitle="Nous sommes à votre disposition pour répondre à toutes vos questions"
      />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2">
            <div className="bg-stone-dark rounded-2xl p-8 border border-stone-medium">
              <h2 className="text-2xl font-bold text-cream-light mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-stone-dark rounded-2xl p-6 sticky top-24 border border-stone-medium">
              <h3 className="text-xl font-semibold text-cream-light mb-6">Nos coordonnées</h3>
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
