import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  title: string
  subtitle?: string
  background?: 'chocolate' | 'stone' | 'cream' | 'transparent'
}

export default function Section({ children, title, subtitle, background = 'transparent' }: SectionProps) {
  const bg = { chocolate: 'bg-chocolate-deep', stone: 'bg-stone-dark', cream: 'bg-cream-light', transparent: 'bg-transparent' }[background]
  return (
    <section className={`${bg} py-16`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-cream-light">{title}</h2>
          {subtitle && <p className="text-lg text-stone-light mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
