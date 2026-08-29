'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'

interface Request {
  _id: string
  name: string
  phone: string
  email: string
  requestType: string
  propertyId?: { _id: string; title: string }
  message: string
  status: string
  createdAt: string
}

interface RequestTableProps {
  requests: Request[]
  onStatusChange: (id: string, status: string, type: string) => void
  onDelete: (id: string, type: string) => void
}

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-500 bg-yellow-500/20',
  PROCESSING: 'text-blue-500 bg-blue-500/20',
  COMPLETED: 'text-green-500 bg-green-500/20',
  CANCELLED: 'text-red-500 bg-red-500/20',
}

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PROCESSING: 'En traitement',
  COMPLETED: 'Traitée',
  CANCELLED: 'Annulée',
}

export default function RequestTable({ requests, onStatusChange, onDelete }: RequestTableProps) {
  if (!requests || requests.length === 0) {
    return <div className="bg-stone-dark rounded-2xl p-8 text-center border border-stone-medium"><p className="text-stone-light">Aucune demande trouvée</p></div>
  }

  return (
    <div className="bg-stone-dark rounded-2xl overflow-hidden border border-stone-medium">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-chocolate-deep">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase">Demandeur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase">Bien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-light uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-medium">
            {requests.map((request) => (
              <tr key={request._id} className="hover:bg-chocolate-deep/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-cream-light font-medium">{request.name}</p>
                  <p className="text-stone-light text-sm">{request.phone}</p>
                  <p className="text-stone-light text-sm">{request.email}</p>
                </td>
                <td className="px-6 py-4 text-stone-light">{request.requestType}</td>
                <td className="px-6 py-4 text-cream-light">{request.propertyId?.title || 'N/A'}</td>
                <td className="px-6 py-4 text-stone-light">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4">
                  <select value={request.status} onChange={(e) => onStatusChange(request._id, e.target.value, request.requestType)} className={`px-3 py-1 rounded-full text-xs ${statusColors[request.status] || 'bg-gray-500/20 text-gray-400'}`}>
                    {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDelete(request._id, request.requestType)} className="p-2 hover:bg-chocolate-deep rounded-xl transition-colors"><Trash2 className="w-4 h-4 text-stone-light hover:text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
