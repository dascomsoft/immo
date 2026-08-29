import { Building2 } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: 'home' | 'building' | 'search' | 'file'
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Building2 className="w-12 h-12 text-stone-light mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-cream-light mb-2">{title}</h3>
      <p className="text-stone-light">{description}</p>
    </div>
  )
}
