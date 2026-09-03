'use client'

import Modal from './Modal'

interface DeleteConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export default function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'
}: DeleteConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 md:space-y-6">
        <p className="text-stone-light text-sm md:text-base">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-medium text-cream-light hover:bg-chocolate-deep/50 transition-colors text-sm md:text-base"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm md:text-base"
          >
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  )
}
