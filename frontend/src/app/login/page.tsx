'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@kedimax.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('📥 Réponse login:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Email ou mot de passe incorrect')
      }

      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      
      console.log('✅ Connexion réussie')
      
      // Rediriger vers le dashboard admin
      router.push('/admin')
    } catch (err: any) {
      console.error('❌ Erreur login:', err)
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chocolate-deep px-4">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-chocolate-deep/80 via-chocolate-deep/50 to-chocolate-deep" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-bronze/10 rounded-2xl border border-bronze/20">
              <Building2 className="w-10 h-10 text-bronze" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-cream-light">Administration</h1>
          <p className="text-stone-light mt-2">Connectez-vous à votre espace</p>
        </div>

        {/* Formulaire */}
        <div className="bg-stone-dark/95 backdrop-blur-xl rounded-2xl border border-stone-medium/30 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erreur */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                ❌ {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-light mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-chocolate-deep/80 text-cream-light rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 placeholder:text-stone-light/50 transition-all"
                  placeholder="admin@kedimax.com"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-stone-light mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-chocolate-deep/80 text-cream-light rounded-xl pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 placeholder:text-stone-light/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-light hover:text-cream-light transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-stone-light hover:text-cream-light transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-medium bg-chocolate-deep text-bronze focus:ring-bronze/50 focus:ring-offset-0"
                />
                Se souvenir de moi
              </label>
              <Link
                href="/mot-de-passe-oublie"
                className="text-bronze hover:text-bronze-light transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bronze hover:bg-bronze-dark text-white py-3.5 rounded-xl transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-bronze/20 hover:shadow-bronze/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Informations de test */}
            <div className="mt-4 pt-4 border-t border-stone-medium/20">
              <p className="text-xs text-stone-light/60 text-center">
                ⚡ Compte de test
              </p>
              <div className="flex justify-center gap-6 text-xs text-stone-light/50 mt-2">
                <span>Email: <span className="text-cream-light">admin@kedimax.com</span></span>
                <span>Mot de passe: <span className="text-cream-light">admin123</span></span>
              </div>
            </div>
          </form>
        </div>

        {/* Lien retour */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-stone-light hover:text-cream-light transition-colors text-sm flex items-center justify-center gap-2"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
