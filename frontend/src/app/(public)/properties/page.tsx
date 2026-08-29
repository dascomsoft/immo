import { Suspense } from 'react'
import PropertyGrid from '@/components/public/PropertyGrid'
import PropertyFilters from '@/components/public/PropertyFilters'
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/common/Container'
import LoadingState from '@/components/admin/LoadingState'

export default function PropertiesPage() {
  return (
    <>
      <PageHeader 
        title="Découvrez nos biens"
        subtitle="Trouvez la perle rare qui correspond à vos besoins"
      />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12">
          <div className="lg:col-span-1">
            <PropertyFilters />
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingState />}>
              <PropertyGrid />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  )
}
