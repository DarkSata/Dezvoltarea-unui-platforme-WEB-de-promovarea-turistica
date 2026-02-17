import { galleryItems } from '../data/home/galleryItems'

export function GallerySection() {
  return (
    <section className="section alt" id="galerie">
      <div className="container">
        <div className="section-head">
          <h2>Galerie de atmosfera</h2>
          <p>Am completat pagina cu cadre tematice ca sa simti directia fiecarei experiente.</p>
        </div>

        <div className="grid gallery-grid">
          {galleryItems.map((item) => (
            <figure className={`gallery-item ${item.id}`} key={item.id}>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
