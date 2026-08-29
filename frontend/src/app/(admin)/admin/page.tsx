'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Building2, Home, DollarSign, Users, Phone, Loader2, TrendingUp } from 'lucide-react'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types'

interface DashboardStats {
  totalProperties: number
  availableProperties: number
  soldProperties: number
  rentedProperties: number
  pendingRequests: number
  recentProperties: Property[]
  recentRequests: {
    id: string
    name: string
    type: string
    status: string
    statusColor: string
    createdAt: string
  }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError('Vous devez être connecté')
          setLoading(false)
          return
        }

        let properties: Property[] = []
        try {
          const response = await propertyService.getProperties({}, 1, 100)
          if (response && response.data) properties = response.data
          else if (Array.isArray(response)) properties = response
        } catch (err) {
          console.error('Erreur biens:', err)
        }

        let contacts: any[] = []
        try {
          const res = await fetch(`${API_URL}/contact`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          })
          if (res.ok) contacts = (await res.json()).data || []
        } catch (err) {
          console.error('Erreur contact:', err)
        }

        let visits: any[] = []
        try {
          const res = await fetch(`${API_URL}/contact/visits`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          })
          if (res.ok) visits = (await res.json()).data || []
        } catch (err) {
          console.error('Erreur visites:', err)
        }

        const totalProperties = properties.length
        const availableProperties = properties.filter(p => p.status === 'AVAILABLE').length
        const soldProperties = properties.filter(p => p.status === 'SOLD').length
        const rentedProperties = properties.filter(p => p.status === 'RENTED').length
        const pendingRequests = 
          contacts.filter((c: any) => c.status === 'PENDING').length +
          visits.filter((v: any) => v.status === 'PENDING').length

        const allRequests = [
          ...contacts.map((c: any) => ({
            id: c._id || `c-${Math.random().toString(36).substr(2, 9)}`,
            name: c.name || 'Inconnu',
            type: 'Demande de contact',
            status: c.status || 'PENDING',
            statusColor: c.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                         c.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                         c.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                         'bg-red-500/10 text-red-400 border-red-500/20',
            createdAt: c.createdAt || new Date().toISOString(),
          })),
          ...visits.map((v: any) => ({
            id: v._id || `v-${Math.random().toString(36).substr(2, 9)}`,
            name: v.name || 'Inconnu',
            type: 'Demande de visite',
            status: v.status || 'PENDING',
            statusColor: v.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                         v.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                         v.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                         'bg-blue-500/10 text-blue-400 border-blue-500/20',
            createdAt: v.createdAt || new Date().toISOString(),
          })),
        ]

        const recentRequests = allRequests
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setStats({
          totalProperties,
          availableProperties,
          soldProperties,
          rentedProperties,
          pendingRequests,
          recentProperties: properties.slice(0, 5),
          recentRequests,
        })
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  // Layout partagé pour tous les états (loading, error, content)
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-chocolate-deep">
      <AdminSidebar />
      {/* 
        MOBILE: pt-16 (header) + pb-20 (bottom nav)
        DESKTOP: lg:ml-64 (sidebar) + lg:pt-20 (header desktop) + lg:pb-0
      */}
      <div className="min-h-screen pt-16 pb-20 lg:ml-64 lg:pt-20 lg:pb-0">
        <AdminHeader title="Tableau de bord" />
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
            <div className="relative">
              <Loader2 className="w-12 h-12 text-bronze animate-spin mx-auto" />
              <div className="absolute inset-0 w-12 h-12 bg-bronze/20 rounded-full blur-xl" />
            </div>
            <p className="mt-4 text-stone-light animate-pulse text-sm">Chargement...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center max-w-sm w-full">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="font-medium mb-4 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-bronze hover:bg-bronze/90 text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm w-full"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-stone-light text-sm">Aucune donnée disponible</p>
        </div>
      </Layout>
    )
  }

  const statCards = [
    { title: 'Total biens', value: stats.totalProperties, icon: <Building2 className="w-5 h-5" />, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
    { title: 'Disponibles', value: stats.availableProperties, icon: <Home className="w-5 h-5" />, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
    { title: 'Vendus', value: stats.soldProperties, icon: <DollarSign className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { title: 'En attente', value: stats.pendingRequests, icon: <Users className="w-5 h-5" />, color: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/20' },
  ]

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'En attente', 'PROCESSING': 'En cours', 'COMPLETED': 'Traitée',
      'CONFIRMED': 'Confirmée', 'CANCELLED': 'Annulée'
    }
    return labels[status] || status
  }

  return (
    <Layout>
      <div className="space-y-5 lg:space-y-6">
        {/* Stats - 2 colonnes sur mobile, 4 sur desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-4 lg:p-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 hover:shadow-xl hover:shadow-black/20`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-white/5 text-bronze">
                  {stat.icon}
                </div>
                <span className="flex items-center gap-1 text-[10px] lg:text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> +8%
                </span>
              </div>
              <p className="text-stone-light/70 text-xs font-medium">{stat.title}</p>
              <p className="text-xl lg:text-2xl font-bold text-cream-light mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Biens récents */}
        <div className="bg-stone-dark/40 backdrop-blur-sm border border-stone-medium/20 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bronze/10 rounded-xl">
                <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-bronze" />
              </div>
              <h2 className="text-base lg:text-lg font-semibold text-cream-light">Derniers biens</h2>
            </div>
            <span className="text-[10px] lg:text-xs font-medium px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-bronze/10 text-bronze border border-bronze/20">
              {stats.recentProperties.length}
            </span>
          </div>
          
          {stats.recentProperties.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-10 h-10 text-stone-light/20 mx-auto mb-3" />
              <p className="text-stone-light text-sm">Aucun bien ajouté récemment</p>
            </div>
          ) : (
            <div className="space-y-2 lg:space-y-3">
              {stats.recentProperties.map((property) => (
                <div key={property._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-chocolate-deep/30 border border-stone-medium/10 rounded-xl hover:bg-chocolate-deep/50 transition-all gap-2 sm:gap-0">
                  <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze flex-shrink-0">
                      <Home className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-cream-light font-medium text-sm truncate">{property.title}</p>
                      <p className="text-stone-light text-xs">{property.city}</p>
                    </div>
                  </div>
                  <span className="text-bronze font-semibold text-sm bg-bronze/5 px-3 py-1.5 rounded-lg border border-bronze/10 self-start sm:self-auto">
                    {property.price.toLocaleString()} {property.currency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demandes récentes */}
        <div className="bg-stone-dark/40 backdrop-blur-sm border border-stone-medium/20 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bronze/10 rounded-xl">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-bronze" />
              </div>
              <h2 className="text-base lg:text-lg font-semibold text-cream-light">Dernières demandes</h2>
            </div>
            <span className="text-[10px] lg:text-xs font-medium px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-bronze/10 text-bronze border border-bronze/20">
              {stats.recentRequests.length}
            </span>
          </div>

          {stats.recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-10 h-10 text-stone-light/20 mx-auto mb-3" />
              <p className="text-stone-light text-sm">Aucune demande récente</p>
            </div>
          ) : (
            <div className="space-y-2 lg:space-y-3">
              {stats.recentRequests.map((request) => (
                <div key={request.id} className="p-3 lg:p-4 bg-chocolate-deep/30 border border-stone-medium/10 rounded-xl hover:bg-chocolate-deep/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-bronze/10 p-1.5 lg:p-2 rounded-lg flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-bronze" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-cream-light font-medium text-sm truncate">{request.name}</p>
                        <p className="text-stone-light text-[10px] lg:text-xs">{request.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-stone-medium/10">
                    <span className={`text-[10px] lg:text-xs font-medium px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-full border ${request.statusColor}`}>
                      {getStatusLabel(request.status)}
                    </span>
                    <span className="text-stone-light text-[10px] lg:text-xs">
                      {new Date(request.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}