import Hero from '@/components/public/Hero'
import FeaturedProperties from '@/components/public/FeaturedProperties'
import ServicesSection from '@/components/public/ServicesSection'
import CTASection from '@/components/public/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FeaturedProperties />
      <CTASection />
    </>
  )
}
