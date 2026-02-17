import { useEffect, useState } from 'react'
import type { Destination } from '../types/destinatii'

export function useLightbox() {
  const [lightboxDestination, setLightboxDestination] = useState<Destination | null>(null)

  useEffect(() => {
    if (!lightboxDestination) {
      document.body.classList.remove('no-scroll')
      return
    }

    document.body.classList.add('no-scroll')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxDestination(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxDestination])

  return { lightboxDestination, setLightboxDestination }
}
