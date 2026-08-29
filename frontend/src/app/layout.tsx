import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Agence Immobilière | Vente et Location',
  description: 'Découvrez des biens immobiliers de qualité. Vente, location et accompagnement personnalisé.',
  keywords: 'immobilier, vente, location, agence immobilière, biens immobiliers',
  openGraph: {
    title: 'Agence Immobilière | Vente et Location',
    description: 'Découvrez des biens immobiliers de qualité. Vente, location et accompagnement personnalisé.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={nunito.variable}>
      <body className="font-sans">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}