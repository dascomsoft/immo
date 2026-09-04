import PropertyGrid from '@/components/public/PropertyGrid'
import PropertyFilters from '@/components/public/PropertyFilters'
import Container from '@/components/common/Container'

export default function PropertiesPage() {
  return (
    <>
      {/* ─── HEADER AVEC BACKGROUND IMAGE ─── */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80")',
        }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-chocolate-deep" />

        {/* Contenu du header */}
        <div className="relative z-10">
          <Container>
            <div className="py-16 sm:py-20 md:py-24 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-light drop-shadow-lg">
                Découvrez nos biens
              </h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white max-w-2xl mx-auto drop-shadow-md">
                Trouvez la perle rare qui correspond à vos besoins
              </p>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12">
          <div className="lg:col-span-1">
            <PropertyFilters />
          </div>
          <div className="lg:col-span-3">
            <PropertyGrid />
          </div>
        </div>
      </Container>
    </>
  )
}