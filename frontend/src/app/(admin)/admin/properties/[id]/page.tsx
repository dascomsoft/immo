'use client'

import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PropertyForm from '@/components/admin/PropertyForm'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  return (
    <div className="flex min-h-screen bg-chocolate-deep">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminHeader title="Modifier le bien" />
        <div className="p-6">
          <div className="bg-stone-dark rounded-2xl p-8 max-w-4xl mx-auto">
            <PropertyForm propertyId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}