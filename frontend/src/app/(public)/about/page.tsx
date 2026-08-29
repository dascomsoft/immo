import Container from '@/components/common/Container'
import PageHeader from '@/components/common/PageHeader'
import { Users, Handshake, Award, Clock } from 'lucide-react'

export default function AboutPage() {
  const values = [
    { icon: <Handshake className="w-8 h-8 text-bronze" />, title: 'Proximité', description: 'Une relation de confiance basée sur l\'écoute et la compréhension de vos besoins.' },
    { icon: <Award className="w-8 h-8 text-bronze" />, title: 'Expertise', description: 'Plus de 15 ans d\'expérience dans le secteur immobilier.' },
    { icon: <Users className="w-8 h-8 text-bronze" />, title: 'Confiance', description: 'Une transparence totale et un accompagnement personnalisé.' },
    { icon: <Clock className="w-8 h-8 text-bronze" />, title: 'Disponibilité', description: 'Une équipe à votre écoute 7 jours sur 7.' }
  ]

  return (
    <>
      <PageHeader 
        title="À propos de nous"
        subtitle="Découvrez notre histoire et nos valeurs"
      />
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-cream-light mb-6">Votre partenaire immobilier de confiance</h2>
              <p className="text-stone-light leading-relaxed mb-4">
                Notre agence immobilière est spécialisée dans la vente et la location de biens d'exception.
                Forts de notre expérience et de notre connaissance du marché, nous vous accompagnons à chaque étape de votre projet.
              </p>
              <p className="text-stone-light leading-relaxed">
                Notre engagement : vous offrir un service personnalisé et des biens de qualité,
                dans le respect de vos besoins et de votre budget.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="bg-stone-dark rounded-2xl p-6 text-center border border-stone-medium hover:border-bronze transition-colors">
                  <div className="flex justify-center mb-3">{value.icon}</div>
                  <h3 className="text-cream-light font-semibold">{value.title}</h3>
                  <p className="text-stone-light text-sm mt-2">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
