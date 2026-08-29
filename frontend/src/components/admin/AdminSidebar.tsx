'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  LogOut,
  Building2,
  Globe,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

const navigation = [
  { name: 'Accueil', href: '/admin', icon: LayoutDashboard, short: 'Dash' },
  { name: 'Biens', href: '/admin/properties', icon: Home, short: 'Biens' },
  { name: 'Demandes', href: '/admin/requests', icon: FileText, short: 'Demandes' },
]

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-stone-medium/20">
        <Link href="/admin" className="flex items-center gap-3 text-xl font-bold text-cream-light group">
          <div className="p-2 bg-bronze/10 rounded-xl border border-bronze/20 group-hover:bg-bronze/20 transition-all">
            <Building2 className="w-6 h-6 text-bronze" />
          </div>
          <span className="tracking-tight">Dashboard</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-stone-light/40 uppercase tracking-widest mb-3">
          Menu principal
        </p>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-bronze text-white shadow-lg shadow-bronze/20'
                  : 'text-stone-light hover:text-cream-light hover:bg-chocolate-deep/60'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}

        <div className="mt-6 pt-4 border-t border-stone-medium/20">
          <p className="px-3 text-[10px] font-bold text-stone-light/40 uppercase tracking-widest mb-3">
            Navigation
          </p>
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-light hover:text-cream-light hover:bg-chocolate-deep/60 transition-all text-sm"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">Site public</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-stone-medium/20 bg-stone-dark/30">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-stone-light hover:text-red-400 transition-all w-full px-4 py-3 rounded-xl hover:bg-red-500/10 group text-sm"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-50 h-screen w-64 bg-stone-dark/95 backdrop-blur-xl border-r border-stone-medium/30 shadow-2xl flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-stone-dark/95 backdrop-blur-xl border-r border-stone-medium/30 shadow-2xl flex-col animate-slide-in">
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose}
                className="p-2 text-stone-light hover:text-cream-light hover:bg-chocolate-deep/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Bottom Navigation Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-dark/95 backdrop-blur-xl border-t border-stone-medium/30 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all min-w-[64px] ${
                  isActive
                    ? 'text-bronze scale-105'
                    : 'text-stone-light hover:text-cream-light'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-lg' : ''}`} />
                <span className="text-[10px] font-medium leading-none">{item.short}</span>
                {isActive && <span className="w-1 h-1 bg-bronze rounded-full mt-0.5" />}
              </Link>
            )
          })}
          
          {/* Lien vers le site public dans la bottom nav */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl text-stone-light hover:text-cream-light transition-all min-w-[64px]"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl text-stone-light hover:text-red-400 transition-all min-w-[64px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Quitter</span>
          </button>
        </div>
      </nav>
    </>
  )
}
