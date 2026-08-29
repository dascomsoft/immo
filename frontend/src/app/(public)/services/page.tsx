import ServicesSection from '@/components/public/ServicesSection'
import CTASection from '@/components/public/CTASection'
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/common/Container'

export default function ServicesPage() {
  return (
    <>
      <PageHeader 
        title="Nos services"
        subtitle="Un accompagnement complet pour votre projet immobilier"
      />
      <Container>
        <ServicesSection />
      </Container>
      <CTASection />
    </>
  )
}
