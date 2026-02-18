import type { Category, CategoryFilter } from '../../types/destinatii'

export const chipOrder: CategoryFilter[] = ['toate', 'Natura', 'Vin', 'Manastiri', 'Istorie', 'Orase']

export const categoryLabel: Record<CategoryFilter, string> = {
  toate: 'Toate',
  Natura: 'Natura',
  Vin: 'Vinarii',
  Manastiri: 'Manastiri',
  Istorie: 'Istorie',
  Orase: 'Orase',
}

export const markerIconByCategory: Record<Category, string> = {
  Natura: 'fa-solid fa-tree',
  Vin: 'fa-solid fa-wine-glass',
  Manastiri: 'fa-solid fa-church',
  Istorie: 'fa-solid fa-landmark',
  Orase: 'fa-solid fa-city',
}

export const fallbackImage = '/images/logo-moldova.png'
