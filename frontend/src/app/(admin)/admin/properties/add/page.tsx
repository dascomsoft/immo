

'use client'

import { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PropertyForm from '@/components/admin/PropertyForm'

export default function AddPropertyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-chocolate-deep">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 min-h-screen lg:ml-64">
        <AdminHeader title="Ajouter un bien" onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-6 max-w-5xl mx-auto mt-16 lg:mt-20 mb-20 lg:mb-0">
          <div className="bg-stone-dark/80 backdrop-blur-sm border border-stone-medium/20 rounded-2xl p-5 lg:p-8">
            <PropertyForm />
          </div>
        </main>
      </div>
    </div>
  )
}
