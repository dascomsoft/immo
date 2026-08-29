'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Phone, 
  Building2, 
  Settings, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  LogOut,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Nos biens', href: '/properties' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
      setIsLoading(false)
    }
    
    checkAuth()
    
    // Écouter les changements de stockage (login/logout cross-tab)
    const handleStorageChange = () => checkAuth()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Vérifier à chaque changement de route
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
    setIsOpen(false)
  }

  // Masquer sur les routes admin
  const isAdminRoute = pathname?.startsWith('/admin')
  if (isAdminRoute) return null

  if (isLoading) {
    return <div className="h-16" />
  }

  return (
    <>
      {/* Epace réservé pour éviter le saut de contenu */}
      <div className="h-16" />
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-chocolate-deep/95 backdrop-blur-xl border-b border-stone-medium/30 shadow-lg shadow-black/10' 
            : 'bg-chocolate-deep/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-cream-light group flex-shrink-0">
              <div className="p-1.5 bg-bronze/10 rounded-lg border border-bronze/20 group-hover:bg-bronze/20 transition-colors">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-bronze" />
              </div>
              <span className="tracking-tight hidden sm:inline">Agence</span>
              <span className="tracking-tight sm:hidden">Agence</span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    pathname === item.href 
                      ? 'text-bronze' 
                      : 'text-cream-light hover:text-bronze'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/admin" 
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                      pathname.startsWith('/admin')
                        ? 'bg-bronze/20 text-bronze border border-bronze/30'
                        : 'text-cream-light hover:text-bronze hover:bg-chocolate-deep/60 border border-transparent'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-stone-light hover:text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-2 text-sm font-medium text-cream-light hover:text-bronze px-4 py-2.5 rounded-xl hover:bg-chocolate-deep/60 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Se connecter
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center gap-2 bg-bronze hover:bg-bronze/90 text-white px-5 py-2.5 rounded-full transition-all duration-200 text-sm font-medium shadow-lg shadow-bronze/20 hover:shadow-bronze/30 hover:scale-105"
                  >
                    <UserPlus className="w-4 h-4" />
                    S'inscrire
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-cream-light p-2 hover:bg-chocolate-deep/50 rounded-xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-stone-medium/30 space-y-1 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === item.href 
                      ? 'text-bronze bg-bronze/10' 
                      : 'text-cream-light hover:text-bronze hover:bg-chocolate-deep/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-stone-medium/30 my-3 pt-3 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-bronze bg-bronze/10 border border-bronze/20 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-cream-light hover:text-bronze hover:bg-chocolate-deep/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Se connecter
                    </Link>
                    <Link 
                      href="/register" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-bronze text-white hover:bg-bronze/90 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      S'inscrire
                    </Link>
                  </>
                )}
              </div>

              <Link 
                href="/contact" 
                className="flex items-center justify-center gap-2 mt-3 bg-bronze hover:bg-bronze/90 text-white px-6 py-3.5 rounded-xl transition-colors text-center font-medium shadow-lg shadow-bronze/20"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-4 h-4" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}