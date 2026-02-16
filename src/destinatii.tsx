import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

type Category = 'Natura' | 'Vin' | 'Manastiri' | 'Istorie' | 'Orase'
type CategoryFilter = Category | 'toate'

type Destination = {
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

const destinations: Destination[] = [
  {
    id: 'orheiul-vechi',
    name: 'Orheiul Vechi',
    category: 'Istorie',
    region: 'Orhei',
    description: 'Complex cultural-natural cu panorame spectaculoase si sit arheologic important.',
    tips: 'Mergi dimineata pentru lumina buna la poze.',
    lat: 47.3047,
    lng: 28.9782,
    image: '/images/destinatii/orheiul-vechi.jpg',
  },
  {
    id: 'tipova',
    name: 'Tipova',
    category: 'Manastiri',
    region: 'Rezina',
    description: 'Manastire rupestra pe malul Nistrului, cu trasee in natura si puncte de belvedere.',
    tips: 'Ia incaltaminte buna, urcusurile sunt abrupte.',
    lat: 47.6051,
    lng: 28.9848,
    image: '/images/destinatii/tipova.jpg',
  },
  {
    id: 'saharna',
    name: 'Saharna',
    category: 'Manastiri',
    region: 'Rezina',
    description: 'Zona celebra pentru cascada, canion si manastirea de la Saharna.',
    tips: 'Combina traseul cascadei cu vizita la manastire.',
    lat: 47.6942,
    lng: 28.9685,
    image: '/images/destinatii/saharna.jpg',
  },
  {
    id: 'capriana',
    name: 'Manastirea Capriana',
    category: 'Manastiri',
    region: 'Straseni',
    description: 'Una dintre cele mai vechi manastiri din Moldova, intr-un cadru linistit de padure.',
    tips: 'Viziteaza in timpul saptamanii pentru mai multa liniste.',
    lat: 47.1181,
    lng: 28.5052,
    image: '/images/destinatii/capriana.jpg',
  },
  {
    id: 'curchi',
    name: 'Manastirea Curchi',
    category: 'Manastiri',
    region: 'Orhei',
    description: 'Ansamblu monastic impresionant, renumit pentru arhitectura eleganta.',
    tips: 'Rezerva 1-2 ore pentru plimbare prin intregul complex.',
    lat: 47.3858,
    lng: 28.9469,
    image: '/images/destinatii/curchi.jpg',
  },
  {
    id: 'cricova',
    name: 'Cricova',
    category: 'Vin',
    region: 'Chisinau',
    description: 'Oras subteran al vinului cu tururi ghidate si degustari tematice.',
    tips: 'Rezerva turul cu cel putin cateva zile inainte.',
    lat: 47.1408,
    lng: 28.861,
    image: '/images/destinatii/cricova.jpg',
  },
  {
    id: 'milestii-mici',
    name: 'Milestii Mici',
    category: 'Vin',
    region: 'Ialoveni',
    description: 'Celebre galerii subterane de vin, o experienta foarte populara.',
    tips: 'Alege varianta de tur cu masina electrica.',
    lat: 46.8892,
    lng: 28.8146,
    image: '/images/destinatii/milestii-mici.jpg',
  },
  {
    id: 'castel-mimi',
    name: 'Castel Mimi',
    category: 'Vin',
    region: 'Bulboaca',
    description: 'Complex modern cu arhitectura eleganta, gastronomie si experiente premium.',
    tips: 'Ideal pentru vizita la apus si cina.',
    lat: 46.8794,
    lng: 29.0604,
    image: '/images/destinatii/castel-mimi.jpg',
  },
  {
    id: 'purcari',
    name: 'Purcari',
    category: 'Vin',
    region: 'Stefan Voda',
    description: 'Domeniu viticol cunoscut pentru vinuri premiate si tururi complete.',
    tips: 'Combinatia tur + degustare + pranz merita.',
    lat: 46.5296,
    lng: 29.862,
    image: '/images/destinatii/purcari.jpg',
  },
  {
    id: 'cetatea-soroca',
    name: 'Cetatea Soroca',
    category: 'Istorie',
    region: 'Soroca',
    description: 'Fortareata medievala circulara pe malul Nistrului, emblema istorica importanta.',
    tips: 'Urca pana la punctele de panorama din apropiere.',
    lat: 48.1567,
    lng: 28.3046,
    image: '/images/destinatii/cetatea-soroca.jpg',
  },
  {
    id: 'cetatea-tighina',
    name: 'Cetatea Tighina',
    category: 'Istorie',
    region: 'Bender',
    description: 'Cetate istorica pe Nistru, cu un rol strategic major in regiune.',
    tips: 'Verifica programul de vizitare inainte de plecare.',
    lat: 46.8307,
    lng: 29.4774,
    image: '/images/destinatii/cetatea-tighina.jpg',
  },
  {
    id: 'manuc-bei',
    name: 'Conacul Manuc Bei',
    category: 'Istorie',
    region: 'Hincesti',
    description: 'Ansamblu istoric restaurat, potrivit pentru vizite culturale si evenimente.',
    tips: 'Include si muzeul pentru context istoric complet.',
    lat: 46.8298,
    lng: 28.5848,
    image: '/images/destinatii/manuc-bei.jpg',
  },
  {
    id: 'codrii',
    name: 'Rezervatia Codrii',
    category: 'Natura',
    region: 'Lozova',
    description: 'Zona forestiera vasta, cu trasee de relaxare aproape de Chisinau.',
    tips: 'Dimineata aerul este mai curat si traseele mai libere.',
    lat: 47.1977,
    lng: 28.5876,
    image: '/images/destinatii/codrii.jpg',
  },
  {
    id: 'padurea-domneasca',
    name: 'Padurea Domneasca',
    category: 'Natura',
    region: 'Glodeni',
    description: 'Rezervatie naturala cu peisaje salbatice, stejari seculari si fauna bogata.',
    tips: 'Ia apa si snacks, traseele sunt lungi.',
    lat: 47.8845,
    lng: 27.6198,
    image: '/images/destinatii/padurea-domneasca.jpg',
  },
  {
    id: 'prutul-de-jos',
    name: 'Prutul de Jos (Lacul Beleu)',
    category: 'Natura',
    region: 'Cahul',
    description: 'Zona umeda protejata, potrivita pentru observarea pasarilor si relaxare.',
    tips: 'Primavara si toamna sunt cele mai bune sezoane.',
    lat: 45.6107,
    lng: 28.1964,
    image: '/images/destinatii/prutul-de-jos.jpg',
  },
  {
    id: 'chisinau',
    name: 'Chisinau',
    category: 'Orase',
    region: 'Municipiu',
    description: 'Capitala cu parcuri mari, muzee, cafenele si viata urbana activa.',
    tips: 'Plimbare recomandata: centru - parc - bulevardul Stefan cel Mare.',
    lat: 47.0105,
    lng: 28.8638,
    image: '/images/destinatii/chisinau.jpg',
  },
  {
    id: 'balti',
    name: 'Balti',
    category: 'Orase',
    region: 'Nord',
    description: 'Oras important din nord, bun punct de plecare pentru excursii regionale.',
    tips: 'Bun pentru oprire de o zi in itinerarii mai lungi.',
    lat: 47.7598,
    lng: 27.9161,
    image: '/images/destinatii/balti.jpg',
  },
  {
    id: 'comrat',
    name: 'Comrat',
    category: 'Orase',
    region: 'Gagauzia',
    description: 'Centru cultural in sudul Moldovei, cu specific local distinct.',
    tips: 'Incearca bucataria locala la restaurantele din centru.',
    lat: 46.2946,
    lng: 28.6565,
    image: '/images/destinatii/comrat.jpg',
  },
]

const chipOrder: CategoryFilter[] = ['toate', 'Natura', 'Vin', 'Manastiri', 'Istorie', 'Orase']

const categoryLabel: Record<CategoryFilter, string> = {
  toate: 'Toate',
  Natura: 'Natura',
  Vin: 'Vinarii',
  Manastiri: 'Manastiri',
  Istorie: 'Istorie',
  Orase: 'Orase',
}

const markerIconByCategory: Record<Category, string> = {
  Natura: 'fa-solid fa-tree',
  Vin: 'fa-solid fa-wine-glass',
  Manastiri: 'fa-solid fa-church',
  Istorie: 'fa-solid fa-landmark',
  Orase: 'fa-solid fa-city',
}

const fallbackImage = '/images/Logo_Image.png'

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildMarkerIcon(category: Category) {
  return L.divIcon({
    className: 'dest-icon',
    html: `<div class="marker"><i class="${markerIconByCategory[category]}" aria-hidden="true"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  })
}

export function DestinatiiPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('toate')
  const [lightboxDestination, setLightboxDestination] = useState<Destination | null>(null)

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const markerByIdRef = useRef<Record<string, L.Marker>>({})

  const currentYear = new Date().getFullYear()

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = normalize(query.trim())

    return destinations.filter((destination) => {
      const matchesCategory = activeCategory === 'toate' || destination.category === activeCategory
      if (!matchesCategory) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const haystack = normalize(
        `${destination.name} ${destination.region} ${destination.category} ${destination.description} ${destination.tips}`,
      )
      return haystack.includes(normalizedQuery)
    })
  }, [activeCategory, query])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([47.1, 28.7], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)

    mapRef.current = map
    markersLayerRef.current = layerGroup

    return () => {
      layerGroup.clearLayers()
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
      markerByIdRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layerGroup = markersLayerRef.current
    if (!map || !layerGroup) {
      return
    }

    layerGroup.clearLayers()
    markerByIdRef.current = {}

    const bounds: Array<[number, number]> = []

    filteredDestinations.forEach((destination) => {
      const marker = L.marker([destination.lat, destination.lng], {
        icon: buildMarkerIcon(destination.category),
        title: destination.name,
      })

      const popupHtml = `
        <div class="popup">
          <strong>${escapeHtml(destination.name)}</strong>
          <div class="popup-tags">
            <span class="pill">${escapeHtml(categoryLabel[destination.category])}</span>
            <span class="pill">${escapeHtml(destination.region)}</span>
          </div>
          <p class="popup-desc">${escapeHtml(destination.description)}</p>
          <p class="popup-tips"><i class="fa-regular fa-lightbulb" aria-hidden="true"></i> ${escapeHtml(destination.tips)}</p>
        </div>
      `

      marker.bindPopup(popupHtml)
      marker.addTo(layerGroup)

      markerByIdRef.current[destination.id] = marker
      bounds.push([destination.lat, destination.lng])
    })

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] })
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 11)
    } else {
      map.setView([47.1, 28.7], 7)
    }
  }, [filteredDestinations])

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

  const flyToDestination = (destination: Destination) => {
    const map = mapRef.current
    const marker = markerByIdRef.current[destination.id]
    if (!map || !marker) {
      return
    }

    map.flyTo([destination.lat, destination.lng], 11, { duration: 1.2 })
    marker.openPopup()
  }

  return (
    <div className="destinatii-page">
      <header className="site-header">
        <a className="brand" href="/index.html" aria-label="Acasa">
          <img className="logo" src="/images/logo-moldova.png" alt="Logo Moldova Travel" />
          <span className="brand-text">Moldova Travel</span>
        </a>

        <button
          id="hamburger"
          className="hamburger"
          type="button"
          aria-label="Deschide meniul"
          aria-controls="site-nav"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <i className="fa-solid fa-bars" aria-hidden="true"></i>
        </button>

        <nav id="site-nav" className={`site-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Navigare principala">
          <a className="nav-link" href="/index.html">
            Acasa
          </a>
          <a className="nav-link active" href="/destinatii.html">
            Destinatii
          </a>
          <a className="nav-link" href="/index.html#rute-rapide">
            Rute
          </a>
          <a className="nav-link" href="/index.html#ghid-rapid">
            Ghid
          </a>
          <a className="nav-link" href="/index.html#galerie">
            Galerie
          </a>
          <a className="nav-link" href="/index.html#contact">
            Contact
          </a>
        </nav>
      </header>

      <main>
        <section className="page-hero">
          <div className="container">
            <p className="hero-kicker">Harta | Filtre | Info rapid</p>
            <h1>Destinatii in Moldova</h1>
            <p className="hero-subtitle">
              Exploreaza locuri turistice (natura, vinarii, manastiri, istorie si orase). Apasa pe un loc din lista ca
              sa-l vezi pe harta.
            </p>

            <div className="hero-actions">
              <a className="btn primary" href="#harta">
                Deschide harta
              </a>
              <a className="btn ghost" href="/index.html">
                Inapoi la pagina principala
              </a>
            </div>

            <div className="note">
              Nota: nu exista o lista oficiala cu toate atractiile. Aici ai o colectie mare de repere populare din
              Moldova, cu coordonate aproximative pentru planificare rapida.
            </div>
          </div>
        </section>

        <section className="section" id="harta">
          <div className="container">
            <div className="section-head">
              <h2>Harta locurilor</h2>
              <p>Cauta, filtreaza pe categorii si planifica usor un itinerar.</p>
            </div>

            <div className="destinations-toolbar" aria-label="Cautare si filtre">
              <label className="search" aria-label="Cauta destinatii">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input
                  id="search"
                  type="search"
                  placeholder="Cauta (ex: Orhei, vinarie, Nistru...)"
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <div className="chips" role="group" aria-label="Filtre categorie">
                {chipOrder.map((category) => (
                  <button
                    key={category}
                    className={`chip ${activeCategory === category ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                  >
                    {categoryLabel[category]}
                  </button>
                ))}
              </div>
            </div>

            <div className="destinations-layout">
              <div className="destinations-map-wrap">
                <div
                  id="map"
                  ref={mapContainerRef}
                  className="destinations-map"
                  role="application"
                  aria-label="Harta cu destinatii"
                ></div>
                <div className="map-hint">
                  <i className="fa-regular fa-hand-pointer" aria-hidden="true"></i> Truc: click pe "Vezi pe harta" ca sa
                  zbori direct la marker.
                </div>
              </div>

              <aside className="destinations-list" aria-label="Lista destinatiilor">
                <div className="destinations-meta">
                  <strong>{filteredDestinations.length}</strong>
                  <span className="muted">locuri afisate</span>
                </div>

                <div id="cards" className="grid cards destinations-cards">
                  {filteredDestinations.map((destination) => (
                    <article className="card destination-card" key={destination.id}>
                      <button
                        className="card-media"
                        type="button"
                        onClick={() => setLightboxDestination(destination)}
                        style={{ backgroundImage: `url('${destination.image}')` }}
                        aria-label={`Mareste poza pentru ${destination.name}`}
                      >
                        <img
                          className="media-preload"
                          src={destination.image}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = fallbackImage
                            event.currentTarget.parentElement?.setAttribute(
                              'style',
                              `background-image: url('${fallbackImage}')`,
                            )
                          }}
                        />
                        <div className="card-media-overlay"></div>
                        <div className="card-media-top">
                          <div className="mini-header">
                            <div className="mini-title">
                              <i className={`${markerIconByCategory[destination.category]}`} aria-hidden="true"></i>
                              <span>{destination.name}</span>
                            </div>
                            <div className="mini-meta">
                              {destination.region} | {categoryLabel[destination.category]}
                            </div>
                          </div>

                          <span className="zoom-badge" aria-hidden="true">
                            <i className="fa-solid fa-magnifying-glass-plus"></i>
                          </span>
                        </div>
                      </button>

                      <div className="card-body">
                        <p>{destination.description}</p>
                        <div className="dest-row">
                          <span className="pill">
                            <i className="fa-solid fa-layer-group" aria-hidden="true"></i> {categoryLabel[destination.category]}
                          </span>
                          <span className="pill">
                            <i className="fa-solid fa-location-dot" aria-hidden="true"></i> {destination.region}
                          </span>
                        </div>
                        <div className="dest-row bottom">
                          <span className="pill tip">
                            <i className="fa-regular fa-lightbulb" aria-hidden="true"></i> {destination.tips}
                          </span>
                        </div>
                        <button className="btn small dest-btn" type="button" onClick={() => flyToDestination(destination)}>
                          Vezi pe harta
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <strong>Moldova Travel</strong>
            <div className="muted">{currentYear}</div>
          </div>

          <div className="footer-right" aria-label="Social media">
            <a className="social" href="https://www.instagram.com/explore/tags/moldovatravel/" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a className="social" href="https://www.facebook.com/search/top?q=moldova%20travel" aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a className="social" href="https://www.youtube.com/results?search_query=moldova+travel" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </footer>

      <div id="lightbox" className={`lightbox ${lightboxDestination ? 'open' : ''}`} aria-hidden={!lightboxDestination}>
        <div className="lightbox-backdrop" onClick={() => setLightboxDestination(null)}></div>
        <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label="Poza marita">
          <button className="lightbox-close" type="button" aria-label="Inchide" onClick={() => setLightboxDestination(null)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img
            id="lightboxImg"
            className="lightbox-img"
            src={lightboxDestination?.image ?? ''}
            alt={lightboxDestination ? `Poza ${lightboxDestination.name}` : 'Poza marita'}
          />
          <div id="lightboxCaption" className="lightbox-caption">
            {lightboxDestination ? `${lightboxDestination.name} | ${lightboxDestination.region}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DestinatiiPage />
  </StrictMode>,
)
