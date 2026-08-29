'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PropertyTable from '@/components/admin/PropertyTable'
import Link from 'next/link'
import { Plus, Loader2, Building2 } from 'lucide-react'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await propertyService.getProperties({}, 1, 100)
      let propertiesData: Property[] = []
      if (response && response.data) {
        propertiesData = response.data
      } else if (Array.isArray(response)) {
        propertiesData = response
      }
      setProperties(propertiesData)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des biens')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return
    try {
      await propertyService.deleteProperty(id)
      setProperties(properties.filter(p => p._id !== id))
    } catch (err) {
      alert('Erreur lors de la suppression du bien')
    }
  }

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await propertyService.togglePublish(id)
      setProperties(properties.map(p => p._id === id ? updated : p))
    } catch (err) {
      alert('Erreur lors du changement de statut')
    }
  }

  // Layout partagé identique au Dashboard
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-chocolate-deep">
      <AdminSidebar />
      <div className="min-h-screen pt-16 pb-20 lg:ml-64 lg:pt-20 lg:pb-0">
        <AdminHeader title="Gestion des biens" />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-bronze animate-spin mx-auto" />
            <p className="mt-3 text-stone-light text-sm animate-pulse">Chargement des biens...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-center max-w-sm w-full">
            <p className="font-medium text-sm mb-4">❌ {error}</p>
            <button 
              onClick={fetchProperties}
              className="bg-bronze hover:bg-bronze/90 text-white px-5 py-2.5 rounded-xl transition-colors font-medium text-sm w-full"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        {/* En-tête mobile-friendly */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bronze/10 rounded-xl">
              <Building2 className="w-5 h-5 text-bronze" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-cream-light">
              {properties.length} bien{properties.length > 1 ? 's' : ''}
            </h2>
          </div>
          <Link 
            href="/admin/properties/add"
            className="bg-bronze hover:bg-bronze/90 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-medium shadow-lg shadow-bronze/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un bien</span>
            <span className="sm:hidden">Ajouter</span>
          </Link>
        </div>

        {/* Tableau avec scroll horizontal sur mobile */}
        <div className="bg-stone-dark/40 backdrop-blur-sm border border-stone-medium/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <PropertyTable 
              properties={properties} 
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}