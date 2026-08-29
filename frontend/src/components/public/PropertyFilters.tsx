'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'

export default function PropertyFilters() {
  const [filters, setFilters] = useState({
    transactionType: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  })

  return (
    <div className="bg-stone-dark rounded-2xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-cream-light mb-6">Filtres</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-stone-light mb-2">Type de transaction</label>
          <select 
            value={filters.transactionType} 
            onChange={(e) => setFilters({...filters, transactionType: e.target.value})} 
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Tous</option>
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-stone-light mb-2">Type de bien</label>
          <select 
            value={filters.propertyType} 
            onChange={(e) => setFilters({...filters, propertyType: e.target.value})} 
            className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bronze"
          >
            <option value="">Tous</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="land">Terrain</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-stone-light mb-2">Prix min</label>
            <input 
              type="number" 
              placeholder="Min" 
              value={filters.minPrice} 
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})} 
              className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bronze"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-light mb-2">Prix max</label>
            <input 
              type="number" 
              placeholder="Max" 
              value={filters.maxPrice} 
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
              className="w-full bg-chocolate-deep text-cream-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bronze"
            />
          </div>
        </div>
        <button className="w-full bg-bronze hover:bg-bronze-dark text-white py-3 rounded-xl transition-colors font-medium">
          Appliquer les filtres
        </button>
      </div>
    </div>
  )
}
