import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type GalleryImage = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  size?: "wide" | "tall";
};

const SAHARNA_IMAGES: GalleryImage[] = [
  {
    id: "saharna-1",
    src: "/images/galerie/manastirea-saharna/saharna-1.png",
    title: "Manastirea Saharna",
    subtitle: "Complex monastic",
  },
  {
    id: "saharna-2",
    src: "/images/galerie/manastirea-saharna/saharna-2.png",
    title: "Manastirea Saharna",
    subtitle: "Cadru vertical",
    size: "tall",
  },
  {
    id: "saharna-3",
    src: "/images/galerie/manastirea-saharna/saharna-3.png",
    title: "Manastirea Saharna",
    subtitle: "Vedere panoramica",
  },
  {
    id: "saharna-4",
    src: "/images/galerie/manastirea-saharna/saharna-4.png",
    title: "Manastirea Saharna",
    subtitle: "Peisaj natural",
  },
  {
    id: "saharna-5",
    src: "/images/galerie/manastirea-saharna/saharna-5.png",
    title: "Manastirea Saharna",
    subtitle: "Atmosfera Saharna",
    size: "wide",
  },
  {
    id: "saharna-6",
    src: "/images/galerie/manastirea-saharna/saharna-6.png",
    title: "Manastirea Saharna",
    subtitle: "Cadru suplimentar",
  },
];

const CRICOVA_IMAGES: GalleryImage[] = [
  {
    id: "cricova-1",
    src: "/images/galerie/cricova/cricova-1.png",
    title: "Cricova",
    subtitle: "Galerii subterane",
  },
  {
    id: "cricova-2",
    src: "/images/galerie/cricova/cricova-2.webp",
    title: "Cricova",
    subtitle: "Panorama locatiei",
    size: "wide",
  },
  {
    id: "cricova-3",
    src: "/images/galerie/cricova/cricova-3.png",
    title: "Cricova",
    subtitle: "Traditie vinicola",
  },
  {
    id: "cricova-4",
    src: "/images/galerie/cricova/cricova-4.png",
    title: "Cricova",
    subtitle: "Cadru de vizitare",
  },
  {
    id: "cricova-5",
    src: "/images/galerie/cricova/cricova-5.png",
    title: "Cricova",
    subtitle: "Atmosfera Cricova",
  },
];

const CHISINAU_IMAGES: GalleryImage[] = [
  {
    id: "chisinau-1",
    src: "/images/galerie/chisinau/chisinau-1.png",
    title: "Chisinau",
    subtitle: "Cadru urban",
  },
  {
    id: "chisinau-2",
    src: "/images/galerie/chisinau/chisinau-2.webp",
    title: "Chisinau",
    subtitle: "Panorama orasului",
    size: "wide",
  },
  {
    id: "chisinau-3",
    src: "/images/galerie/chisinau/chisinau-3.png",
    title: "Chisinau",
    subtitle: "Locuri reprezentative",
  },
  {
    id: "chisinau-4",
    src: "/images/galerie/chisinau/chisinau-4.png",
    title: "Chisinau",
    subtitle: "Cadru central",
  },
  {
    id: "chisinau-5",
    src: "/images/galerie/chisinau/chisinau-5.png",
    title: "Chisinau",
    subtitle: "Atmosfera urbana",
  },
];

const SOROCA_IMAGES: GalleryImage[] = [
  {
    id: "soroca-1",
    src: "/images/galerie/cetatea-soroca/cetatea-soroca-1.png",
    title: "Cetatea Soroca",
    subtitle: "Vedere spre fortareata",
    size: "wide",
  },
  {
    id: "soroca-2",
    src: "/images/galerie/cetatea-soroca/cetatea-soroca-2.png",
    title: "Cetatea Soroca",
    subtitle: "Detaliu exterior",
  },
  {
    id: "soroca-3",
    src: "/images/galerie/cetatea-soroca/cetatea-soroca-3.png",
    title: "Cetatea Soroca",
    subtitle: "Cadru istoric",
  },
  {
    id: "soroca-4",
    src: "/images/galerie/cetatea-soroca/cetatea-soroca-4.png",
    title: "Cetatea Soroca",
    subtitle: "Panorama cetatii",
  },
  {
    id: "soroca-5",
    src: "/images/galerie/cetatea-soroca/cetatea-soroca-5.png",
    title: "Cetatea Soroca",
    subtitle: "Cadru suplimentar",
  },
];

const ORHEI_IMAGES: GalleryImage[] = [
  {
    id: "orhei-panoramic",
    src: "/images/galerie/orheiul-vechi/orhei-panoramic.webp",
    title: "Panorama Orheiul Vechi",
    subtitle: "Valea Rautului",
    size: "wide",
  },
  {
    id: "orhei-manastirea",
    src: "/images/galerie/orheiul-vechi/orhei-manastirea-pestera.webp",
    title: "Manastirea rupestra",
    subtitle: "Orheiul Vechi",
    size: "tall",
  },
  {
    id: "orhei-1",
    src: "/images/galerie/orheiul-vechi/orhei-1.png",
    title: "Orheiul Vechi",
    subtitle: "Cadru 1",
  },
  {
    id: "orhei-2",
    src: "/images/galerie/orheiul-vechi/orhei-2.png",
    title: "Orheiul Vechi",
    subtitle: "Cadru 2",
  },
  {
    id: "orhei-3",
    src: "/images/galerie/orheiul-vechi/orhei-3.png",
    title: "Orheiul Vechi",
    subtitle: "Cadru 3",
  },
];

const GALLERY_IMAGES = [
  ...SAHARNA_IMAGES,
  ...CRICOVA_IMAGES,
  ...CHISINAU_IMAGES,
  ...SOROCA_IMAGES,
  ...ORHEI_IMAGES,
];

export default function GalleryPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeImage = useMemo(
    () => GALLERY_IMAGES.find((item) => item.id === activeId) ?? null,
    [activeId],
  );

  useEffect(() => {
    if (!activeImage) return;

    document.body.classList.add("no-scroll");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [activeImage]);

  function closeLightbox() {
    setActiveId(null);
  }

  return (
    <div className="gallery-page">
      <section className="page-hero gallery-hero">
        <div className="container">
          <p className="hero-kicker">Galerie foto</p>
          <h1>Manastirea Saharna in imagini</h1>
          <p className="hero-subtitle">
            O selectie de cadre dedicate Manastirii Saharna, alaturi de galeriile
            existente pentru Cricova, Chisinau, Cetatea Soroca si Orheiul Vechi.
          </p>
          <div className="hero-actions gallery-actions">
            <a className="btn ghost" href="#galerie-saharna">
              Vezi Saharna
            </a>
            <Link className="btn primary" to="/destinations">
              Vezi toate destinatiile
            </Link>
          </div>
          <div className="note gallery-note">
            Daca ai imagini noi pentru alte destinatii, le putem integra in aceasta galerie.
          </div>
        </div>
      </section>

      <section className="section" id="galerie-saharna">
        <div className="container">
          <div className="section-head">
            <h2>Galerie foto Manastirea Saharna</h2>
            <p>Imaginile de mai jos sunt dedicate Manastirii Saharna si peisajelor din zona.</p>
          </div>

          <div className="gallery-photos-grid">
            {SAHARNA_IMAGES.map((item) => (
              <figure
                key={item.id}
                className={`gallery-photo${item.size ? ` ${item.size}` : ""}`}
              >
                <button
                  className="gallery-photo-card"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Mareste imaginea: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span className="gallery-photo-zoom" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </button>
                <figcaption className="gallery-photo-meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="galerie-cricova">
        <div className="container">
          <div className="section-head">
            <h2>Galerie foto Cricova</h2>
            <p>Imaginile de mai jos sunt dedicate Cricovei si traseelor sale turistice.</p>
          </div>

          <div className="gallery-photos-grid">
            {CRICOVA_IMAGES.map((item) => (
              <figure
                key={item.id}
                className={`gallery-photo${item.size ? ` ${item.size}` : ""}`}
              >
                <button
                  className="gallery-photo-card"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Mareste imaginea: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span className="gallery-photo-zoom" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </button>
                <figcaption className="gallery-photo-meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="galerie-chisinau">
        <div className="container">
          <div className="section-head">
            <h2>Galerie foto Chisinau</h2>
            <p>Imaginile de mai jos sunt dedicate orasului Chisinau si locurilor sale reprezentative.</p>
          </div>

          <div className="gallery-photos-grid">
            {CHISINAU_IMAGES.map((item) => (
              <figure
                key={item.id}
                className={`gallery-photo${item.size ? ` ${item.size}` : ""}`}
              >
                <button
                  className="gallery-photo-card"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Mareste imaginea: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span className="gallery-photo-zoom" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </button>
                <figcaption className="gallery-photo-meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="galerie-soroca">
        <div className="container">
          <div className="section-head">
            <h2>Galerie foto Cetatea Soroca</h2>
            <p>Imaginile de mai jos sunt dedicate Cetatii Soroca si zonei de pe malul Nistrului.</p>
          </div>

          <div className="gallery-photos-grid">
            {SOROCA_IMAGES.map((item) => (
              <figure
                key={item.id}
                className={`gallery-photo${item.size ? ` ${item.size}` : ""}`}
              >
                <button
                  className="gallery-photo-card"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Mareste imaginea: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span className="gallery-photo-zoom" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </button>
                <figcaption className="gallery-photo-meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="galerie-orhei">
        <div className="container">
          <div className="section-head">
            <h2>Galerie foto Orheiul Vechi</h2>
            <p>Toate imaginile de mai jos sunt dedicate exclusiv locatiei Orheiul Vechi.</p>
          </div>

          <div className="gallery-photos-grid">
            {ORHEI_IMAGES.map((item) => (
              <figure
                key={item.id}
                className={`gallery-photo${item.size ? ` ${item.size}` : ""}`}
              >
                <button
                  className="gallery-photo-card"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Mareste imaginea: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span className="gallery-photo-zoom" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </button>
                <figcaption className="gallery-photo-meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className={`lightbox ${activeImage ? "open" : ""}`} aria-hidden={!activeImage}>
        <div className="lightbox-backdrop" data-close="1" onClick={closeLightbox}></div>
        <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label="Imagine galerie">
          <button className="lightbox-close" type="button" aria-label="Inchide" onClick={closeLightbox}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img
            className="lightbox-img"
            src={activeImage?.src}
            alt={activeImage?.title ?? "Imagine galerie"}
          />
          <div className="lightbox-caption">
            {activeImage ? `${activeImage.title} | ${activeImage.subtitle}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
