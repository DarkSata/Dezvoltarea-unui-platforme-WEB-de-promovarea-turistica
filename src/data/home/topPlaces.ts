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
      '/images/destinatii/top-optimized/orheiul-vechi.jpg',
      '/images/destinatii/top-optimized/tipova.jpg',
      '/images/destinatii/top-optimized/saharna.jpg',
      '/images/destinatii/top-optimized/curchi.jpg',
    ],
  },
  {
    id: 'cricova',
    name: 'Cricova',
    description: 'Oras subteran al vinului, perfect pentru tururi si degustari.',
    vibe: 'degustari premium',
    collageImages: [
      '/images/destinatii/top-optimized/cricova.jpg',
      '/images/destinatii/top-optimized/milestii-mici.jpg',
      '/images/destinatii/top-optimized/purcari.jpg',
      '/images/destinatii/top-optimized/castel-mimi.jpg',
    ],
  },
  {
    id: 'tipova',
    name: 'Tipova',
    description: 'Manastire rupestra pe Nistru plus panorame si natura salbatica.',
    vibe: 'vibe de aventura',
    collageImages: [
      '/images/destinatii/top-optimized/tipova.jpg',
      '/images/destinatii/top-optimized/saharna.jpg',
      '/images/destinatii/top-optimized/orheiul-vechi.jpg',
      '/images/destinatii/top-optimized/prutul-de-jos.jpg',
    ],
  },
  {
    id: 'soroca',
    name: 'Cetatea Soroca',
    description: 'Fortareata medievala pe malul Nistrului, super fotogenica.',
    vibe: 'arhitectura medievala',
    collageImages: [
      '/images/destinatii/top-optimized/cetatea-soroca.jpg',
      '/images/destinatii/top-optimized/cetatea-tighina.jpg',
      '/images/destinatii/top-optimized/balti.jpg',
      '/images/destinatii/top-optimized/chisinau.jpg',
    ],
  },
  {
    id: 'codrii',
    name: 'Codrii',
    description: 'Paduri, aer curat si plimbari relaxante aproape de Chisinau.',
    vibe: 'escape in natura',
    collageImages: [
      '/images/destinatii/top-optimized/codrii.jpg',
      '/images/destinatii/top-optimized/padurea-domneasca.jpg',
      '/images/destinatii/top-optimized/prutul-de-jos.jpg',
      '/images/destinatii/top-optimized/capriana.jpg',
    ],
  },
  {
    id: 'castel-mimi',
    name: 'Castel Mimi',
    description: 'Arhitectura eleganta, vin, gastronomie si evenimente.',
    vibe: 'lux relaxat',
    collageImages: [
      '/images/destinatii/top-optimized/castel-mimi.jpg',
      '/images/destinatii/top-optimized/purcari.jpg',
      '/images/destinatii/top-optimized/cricova.jpg',
      '/images/destinatii/top-optimized/milestii-mici.jpg',
    ],
  },
]
