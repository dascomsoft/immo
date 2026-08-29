interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-chocolate-deep py-20 border-b border-stone-medium">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-cream-light mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-stone-light">{subtitle}</p>}
      </div>
    </div>
  )
}
