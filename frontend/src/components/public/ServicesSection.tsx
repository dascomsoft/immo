import ServiceCard from './ServiceCard'
import { Home, Building2, Handshake } from 'lucide-react'

const services = [
  { 
    icon: <Home className="w-8 h-8 text-bronze" />, 
    title: 'Location', 
    description: 'Trouvez le bien locatif qui correspond à vos besoins.',
    items: ['Chambre', 'Studio', 'Appartement', 'Maison', 'Espace commercial']
  },
  { 
    icon: <Building2 className="w-8 h-8 text-bronze" />, 
    title: 'Vente', 
    description: 'Vendez ou achetez votre bien immobilier en toute confiance.',
    items: ['Terrain', 'Villa', 'Duplex', 'Immeuble', 'Autres biens']
  },
  { 
    icon: <Handshake className="w-8 h-8 text-bronze" />, 
    title: 'Accompagnement', 
    description: 'Un suivi personnalisé à chaque étape de votre projet.',
    items: ['Conseil', 'Recherche de bien', 'Visite', 'Accompagnement client']
  },
]

export default function ServicesSection() {
  return (
    <section className="py-16 bg-chocolate-deep">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-cream-light">Nos services</h2>
          <p className="text-stone-light mt-2">Des services complets pour répondre à tous vos besoins</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
