'use client'

import { useState } from 'react'
import { Search, Home, MapPin, DollarSign, ChevronDown } from 'lucide-react'

export default function SearchBar() {
  const [propertyType, setPropertyType] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ propertyType, transactionType, location, budget })
  }

  return (
    <div className="bg-stone-dark/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-stone-medium">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Type de bien</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="villa">Villa</option>
            <option value="land">Terrain</option>
            <option value="studio">Studio</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Achat / Location</option>
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
          <input
            type="text"
            placeholder="Localisation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze placeholder:text-stone-light"
          />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-chocolate-deep text-cream-light rounded-xl pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Budget</option>
            <option value="100000">100 000 €</option>
            <option value="200000">200 000 €</option>
            <option value="300000">300 000 €</option>
            <option value="500000">500 000 €</option>
            <option value="1000000">1 000 000 €</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
        </div>

        <button
          type="submit"
          className="col-span-full md:col-span-4 bg-bronze hover:bg-bronze-dark text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Search className="w-5 h-5" /> Rechercher
        </button>
      </form>
    </div>
  )
}
