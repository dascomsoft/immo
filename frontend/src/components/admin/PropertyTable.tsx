'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Property } from '@/types'
import DeleteConfirm from './DeleteConfirm'

interface PropertyTableProps {
  properties: Property[]
  onDelete: (id: string) => void
  onTogglePublish: (id: string) => void
}

export default function PropertyTable({ properties, onDelete, onTogglePublish }: PropertyTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
      setIsModalOpen(false)
    }
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-stone-dark rounded-2xl p-8 text-center border border-stone-medium">
        <p className="text-stone-light">Aucun bien trouvé</p>
        <Link 
          href="/admin/properties/add"
          className="inline-block mt-4 bg-bronze hover:bg-bronze-dark text-white px-4 py-2 rounded-full transition-colors"
        >
          Ajouter votre premier bien
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-stone-dark rounded-2xl overflow-hidden border border-stone-medium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-chocolate-deep">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-light uppercase tracking-wider">Publié</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-medium">
              {properties.map((property) => (
                <tr key={property._id} className="hover:bg-chocolate-deep/50 transition-colors">
                  <td className="px-6 py-4 text-cream-light font-medium">{property.title}</td>
                  <td className="px-6 py-4 text-stone-light">{property.type}</td>
                  <td className="px-6 py-4 text-bronze font-semibold">
                    {property.price.toLocaleString()} {property.currency}
                  </td>
                  <td className="px-6 py-4 text-stone-light">{property.city}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      property.status === 'AVAILABLE' 
                        ? 'bg-green-500/20 text-green-400' 
                        : property.status === 'SOLD'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onTogglePublish(property._id)}
                      className="hover:scale-110 transition-transform"
                    >
                      {property.published ? (
                        <Eye className="w-4 h-4 text-green-400 hover:text-green-300" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-400 hover:text-red-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties/${property._id}`}
                        className="p-2 hover:bg-chocolate-deep rounded-xl transition-colors"
                      >
                        <Edit className="w-4 h-4 text-stone-light hover:text-bronze" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(property._id)}
                        className="p-2 hover:bg-chocolate-deep rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-stone-light hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible."
      />
    </>
  )
}
