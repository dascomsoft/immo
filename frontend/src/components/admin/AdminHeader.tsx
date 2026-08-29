'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, User, Settings, LogOut, Menu } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  onMenuClick?: () => void
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-40 bg-stone-dark/95 backdrop-blur-xl border-b border-stone-medium/30 h-16 flex items-center">
      <div className="w-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Titre avec menu mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-cream-light hover:text-bronze transition-colors p-2 hover:bg-chocolate-deep/50 rounded-xl"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg lg:text-2xl font-bold text-cream-light tracking-tight truncate">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <div className="relative hidden sm:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light group-focus-within:text-bronze transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-chocolate-deep/80 text-cream-light rounded-xl pl-10 pr-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-bronze/50 
                placeholder:text-stone-light text-sm w-40 lg:w-48 transition-all duration-300 focus:w-52 lg:focus:w-64"
            />
          </div>

          <button 
            className="relative text-stone-light hover:text-cream-light transition-all p-2 hover:bg-chocolate-deep/60 rounded-xl active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-stone-dark">
              3
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 transition-all p-1.5 rounded-full border ${
                isProfileOpen 
                  ? 'bg-chocolate-deep/60 border-bronze/30 text-bronze' 
                  : 'text-cream-light hover:text-bronze hover:bg-chocolate-deep/50 border-transparent'
              }`}
            >
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-bronze to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="hidden lg:block text-sm font-medium">Admin</span>
            </button>

            <div 
              className={`absolute right-0 top-full mt-2 w-60 lg:w-64 bg-stone-dark/95 backdrop-blur-xl rounded-2xl border border-stone-medium/30 shadow-2xl overflow-hidden transition-all duration-200 origin-top-right ${
                isProfileOpen 
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="p-3 lg:p-4 border-b border-stone-medium/30 bg-chocolate-deep/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-bronze to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-cream-light font-semibold text-sm truncate">Administrateur</p>
                    <p className="text-stone-light text-xs truncate">admin@kedimax.com</p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-0.5">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-stone-light hover:text-cream-light hover:bg-chocolate-deep/50 rounded-xl transition-all text-sm group">
                  <User className="w-4 h-4 group-hover:text-bronze transition-colors flex-shrink-0" />
                  <span>Mon profil</span>
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 text-stone-light hover:text-cream-light hover:bg-chocolate-deep/50 rounded-xl transition-all text-sm group">
                  <Settings className="w-4 h-4 group-hover:text-bronze transition-colors flex-shrink-0" />
                  <span>Paramètres</span>
                </button>
                <div className="border-t border-stone-medium/20 my-1" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm group"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
