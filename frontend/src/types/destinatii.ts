export type Category = 'Natura' | 'Vin' | 'Manastiri' | 'Istorie' | 'Orase'
export type CategoryFilter = Category | 'toate'

export type Destination = {
  id: string
  name: string
  category: Category
  region: string
  description: string
  tips: string
  lat: number
  lng: number
  image: string
}
