import { ReactNode } from 'react'

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  items: string[]
}

export default function ServiceCard({ icon, title, description, items }: ServiceCardProps) {
  return (
    <div className="bg-stone-dark rounded-2xl p-6 border border-stone-medium hover:border-bronze transition-all hover:-translate-y-1 h-full">
      <div className="flex items-center justify-center w-14 h-14 bg-bronze/10 rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-cream-light mb-2">{title}</h3>
      <p className="text-stone-light text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-cream-light text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-bronze rounded-full flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
