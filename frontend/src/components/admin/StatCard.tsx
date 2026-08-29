import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-stone-dark rounded-2xl p-6 border border-stone-medium">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-stone-light text-sm">{title}</p>
          <p className="text-2xl font-bold text-cream-light mt-1">{value}</p>
        </div>
        <div className="bg-bronze/20 p-3 rounded-xl text-bronze">{icon}</div>
      </div>
    </div>
  )
}
