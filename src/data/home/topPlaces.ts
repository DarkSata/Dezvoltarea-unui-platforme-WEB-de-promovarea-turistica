import type { Destination } from '../../types/home'

export type TopPlace = Destination & {
  collageImages: string[]
}

export const topPlaces: TopPlace[] = [
  {
    id: 'orheiul-vechi',
    name: 'Orheiul Vechi',
    description: 'Complex cultural-natural cu privelisti superbe si trasee usoare.',
    vibe: 'canioane si istorie',
    collageImages: [
      '/images/destinatii/orheiul-vechi.jpg',
      '/images/destinatii/tipova.jpg',
      '/images/destinatii/saharna.jpg',
      '/images/destinatii/curchi.jpg',
    ],
  },
  {
    id: 'cricova',
    name: 'Cricova',
    description: 'Oras subteran al vinului, perfect pentru tururi si degustari.',
    vibe: 'degustari premium',
    collageImages: [
      '/images/destinatii/cricova.jpg',
      '/images/destinatii/milestii-mici.jpg',
      '/images/destinatii/purcari.jpg',
      '/images/destinatii/castel-mimi.jpg',
    ],
  },
  {
    id: 'tipova',
    name: 'Tipova',
    description: 'Manastire rupestra pe Nistru plus panorame si natura salbatica.',
    vibe: 'vibe de aventura',
    collageImages: [
      '/images/destinatii/tipova.jpg',
      '/images/destinatii/saharna.jpg',
      '/images/destinatii/orheiul-vechi.jpg',
      '/images/destinatii/prutul-de-jos.jpg',
    ],
  },
  {
    id: 'soroca',
    name: 'Cetatea Soroca',
    description: 'Fortareata medievala pe malul Nistrului, super fotogenica.',
    vibe: 'arhitectura medievala',
    collageImages: [
      '/images/destinatii/cetatea-soroca.jpg',
      '/images/destinatii/cetatea-tighina.jpg',
      '/images/destinatii/balti.jpg',
      '/images/destinatii/chisinau.jpg',
    ],
  },
  {
    id: 'codrii',
    name: 'Codrii',
    description: 'Paduri, aer curat si plimbari relaxante aproape de Chisinau.',
    vibe: 'escape in natura',
    collageImages: [
      '/images/destinatii/codrii.jpg',
      '/images/destinatii/padurea-domneasca.jpg',
      '/images/destinatii/prutul-de-jos.jpg',
      '/images/destinatii/capriana.jpg',
    ],
  },
  {
    id: 'castel-mimi',
    name: 'Castel Mimi',
    description: 'Arhitectura eleganta, vin, gastronomie si evenimente.',
    vibe: 'lux relaxat',
    collageImages: [
      '/images/destinatii/castel-mimi.jpg',
      '/images/destinatii/purcari.jpg',
      '/images/destinatii/cricova.jpg',
      '/images/destinatii/milestii-mici.jpg',
    ],
  },
]
