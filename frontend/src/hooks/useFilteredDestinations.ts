import { useMemo } from 'react'
import type { CategoryFilter, Destination } from '../types/destinatii'
import { normalize } from '../utils/string'

export function useFilteredDestinations(destinations: Destination[], query: string, activeCategory: CategoryFilter) {
  return useMemo(() => {
    const normalizedQuery = normalize(query.trim())
    return destinations.filter((destination) => {
      const matchesCategory = activeCategory === 'toate' || destination.category === activeCategory
      if (!matchesCategory) return false
      if (!normalizedQuery) return true
      const haystack = normalize(
        `${destination.name} ${destination.region} ${destination.category} ${destination.description} ${destination.tips}`,
      )
      return haystack.includes(normalizedQuery)
    })
  }, [activeCategory, destinations, query])
}
