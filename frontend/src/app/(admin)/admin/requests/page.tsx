'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import RequestTable from '@/components/admin/RequestTable'
import { Loader2, FileText, RefreshCw } from 'lucide-react'

interface Request {
  _id: string
  name: string
  phone: string
  email: string
  requestType: string
  propertyId?: {
    _id: string
    title: string
  }
  message: string
  status: string
  createdAt: string
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
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

      const [contactRes, visitsRes] = await Promise.all([
        fetch(`${API_URL}/contact`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
        fetch(`${API_URL}/contact/visits`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
      ])

      let allRequests: Request[] = []
      
      if (contactRes.ok) {
        const contactData = await contactRes.json()
        allRequests = [...allRequests, ...(contactData.data || []).map((item: any) => ({
          ...item,
          requestType: item.requestType || 'CONTACT',
        }))]
      }
      
      if (visitsRes.ok) {
        const visitsData = await visitsRes.json()
        allRequests = [...allRequests, ...(visitsData.data || []).map((item: any) => ({
          ...item,
          requestType: 'VISIT',
        }))]
      }
      
      allRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      setRequests(allRequests)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleStatusChange = async (id: string, status: string, type: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('token')
      
      const endpoint = type === 'VISIT' 
        ? `${API_URL}/contact/visits/${id}/status`
        : `${API_URL}/contact/${id}/status`
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        fetchRequests()
      } else {
        alert('Erreur lors du changement de statut')
      }
    } catch (err) {
      alert('Erreur lors du changement de statut')
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Vous devez être connecté')
        return
      }

      const endpoint = type === 'VISIT'
        ? `${API_URL}/contact/visits/${id}`
        : `${API_URL}/contact/${id}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await fetchRequests()
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.message || 'Erreur lors de la suppression'}`)
      }
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-chocolate-deep">
      <AdminSidebar />
      <div className="min-h-screen pt-16 pb-20 lg:ml-64 lg:pt-20 lg:pb-0">
        <AdminHeader title="Gestion des demandes" />
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
            <p className="mt-3 text-stone-light text-sm animate-pulse">Chargement des demandes...</p>
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
              onClick={fetchRequests}
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
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bronze/10 rounded-xl">
              <FileText className="w-5 h-5 text-bronze" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-cream-light">
              {requests.length} demande{requests.length > 1 ? 's' : ''}
            </h2>
          </div>
          <button
            onClick={fetchRequests}
            className="bg-stone-dark hover:bg-chocolate-deep/60 text-cream-light border border-stone-medium/30 px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>

        {/* Tableau scrollable horizontal sur mobile */}
        <div className="bg-stone-dark/40 backdrop-blur-sm border border-stone-medium/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <RequestTable 
              requests={requests}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}