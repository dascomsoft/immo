'use client'

import { useState } from 'react'
import { Menu, X, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PropertyForm from '@/components/admin/PropertyForm'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-chocolate-deep">
      {/* Overlay sombre mobile quand la sidebar est ouverte */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar : drawer sur mobile, fixed sur desktop */}
      <div
        className={`
          fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <AdminSidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 lg:ml-0">
        {/* Barre mobile sticky avec hamburger */}
        <div className="lg:hidden flex items-center justify-between gap-4 px-4 py-3 bg-stone-dark/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-medium/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-chocolate-deep text-cream-light hover:bg-chocolate-deep/80 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-cream-light truncate">
              Modifier le bien
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`
              p-2 rounded-xl bg-chocolate-deep text-cream-light transition-colors
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header desktop */}
        <AdminHeader title="Modifier le bien" />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-stone-light mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-cream-light transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              href="/admin/properties"
              className="hover:text-cream-light transition-colors"
            >
              Biens
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-cream-light truncate max-w-[120px] sm:max-w-xs">
              Modifier
            </span>
          </nav>

          {/* Carte principale */}
          <div className="bg-stone-dark rounded-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto shadow-xl shadow-black/10 border border-stone-medium/20">
            {/* En-tête de la carte */}
            <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-stone-medium/30">
              <h2 className="text-xl sm:text-2xl font-bold text-cream-light">
                Modifier le bien
              </h2>
              <p className="text-stone-light text-sm sm:text-base mt-1">
                Mettez à jour les informations du bien immobilier. Tous les champs marqués d'un * sont obligatoires.
              </p>
            </div>

            <PropertyForm propertyId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}