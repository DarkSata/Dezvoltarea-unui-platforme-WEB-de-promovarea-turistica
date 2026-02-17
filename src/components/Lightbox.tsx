import type { Destination } from '../types/destinatii'

type LightboxProps = {
  destination: Destination | null
  onClose: () => void
}

export function Lightbox({ destination, onClose }: LightboxProps) {
  return (
    <div id="lightbox" className={`lightbox ${destination ? 'open' : ''}`} aria-hidden={!destination}>
      <div className="lightbox-backdrop" onClick={onClose}></div>
      <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label="Poza marita">
        <button className="lightbox-close" type="button" aria-label="Inchide" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <img
          id="lightboxImg"
          className="lightbox-img"
          src={destination?.image ?? ''}
          alt={destination ? `Poza ${destination.name}` : 'Poza marita'}
        />
        <div id="lightboxCaption" className="lightbox-caption">
          {destination ? `${destination.name} | ${destination.region}` : ''}
        </div>
      </div>
    </div>
  )
}
