import ServicesSection from '@/components/public/ServicesSection'
import CTASection from '@/components/public/CTASection'
import Container from '@/components/common/Container'

export default function ServicesPage() {
  return (
    <>
      {/* ─── HEADER AVEC BACKGROUND IMAGE ─── */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80")',
        }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-chocolate-deep" />

        {/* Contenu du header */}
        <div className="relative z-10">
          <Container>
            <div className="py-16 sm:py-20 md:py-24 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Nos services
              </h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white max-w-2xl mx-auto drop-shadow-md">
                Un accompagnement complet pour votre projet immobilier
              </p>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <ServicesSection />
      </Container>
      <CTASection />
    </>
  )
}