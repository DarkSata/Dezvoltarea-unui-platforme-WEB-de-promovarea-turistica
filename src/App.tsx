import { useEffect, useState } from 'react'
import './App.css'

type NavLink = {
  label: string
  href: string
}

type Destination = {
  id: string
  name: string
  description: string
  href: string
  vibe: string
}

type RouteIdea = {
  icon: string
  title: string
  points: string[]
  href: string
}

type Perk = {
  icon: string
  title: string
  description: string
}

type ChecklistItem = {
  title: string
  description: string
}

type GalleryItem = {
  id: string
  title: string
  subtitle: string
}

type Testimonial = {
  quote: string
  author: string
}

const navLinks: NavLink[] = [
  { label: 'Acasa', href: '#home' },
  { label: 'Destinatii', href: '/destinatii.html' },
  { label: 'Rute', href: '#rute-rapide' },
  { label: 'Ghid', href: '#ghid-rapid' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
]

const topPlaces: Destination[] = [
  {
    id: 'orheiul-vechi',
    name: 'Orheiul Vechi',
    description: 'Complex cultural-natural cu privelisti superbe si trasee usoare.',
    href: '#top-locuri',
    vibe: 'canioane si istorie',
  },
  {
    id: 'cricova',
    name: 'Cricova',
    description: 'Oras subteran al vinului, perfect pentru tururi si degustari.',
    href: '#top-locuri',
    vibe: 'degustari premium',
  },
  {
    id: 'tipova',
    name: 'Tipova',
    description: 'Manastire rupestra pe Nistru plus panorame si natura salbatica.',
    href: '#top-locuri',
    vibe: 'vibe de aventura',
  },
  {
    id: 'soroca',
    name: 'Cetatea Soroca',
    description: 'Fortareata medievala pe malul Nistrului, super fotogenica.',
    href: '#top-locuri',
    vibe: 'arhitectura medievala',
  },
  {
    id: 'codrii',
    name: 'Codrii',
    description: 'Paduri, aer curat si plimbari relaxante aproape de Chisinau.',
    href: '#top-locuri',
    vibe: 'escape in natura',
  },
  {
    id: 'castel-mimi',
    name: 'Castel Mimi',
    description: 'Arhitectura eleganta, vin, gastronomie si evenimente.',
    href: '#top-locuri',
    vibe: 'lux relaxat',
  },
]

const routeIdeas: RouteIdea[] = [
  {
    icon: 'fa-solid fa-clock',
    title: '1 zi: Chisinau + Cricova',
    points: ['Dimineata: centru Chisinau + parcuri', 'Pranz: bucatarie locala', 'Dupa-amiaza: tur Cricova'],
    href: '#rute-rapide',
  },
  {
    icon: 'fa-solid fa-route',
    title: '2 zile: Orheiul Vechi + vinarie',
    points: ['Ziua 1: Orheiul Vechi + Butuceni', 'Ziua 2: vinarie (Cricova / Milestii Mici)', 'Bonus: apus la punct panoramic'],
    href: '#rute-rapide',
  },
  {
    icon: 'fa-solid fa-mountain-sun',
    title: '3 zile: Nistru (Tipova) + Soroca',
    points: ['Ziua 1: drum spre Nistru + plimbare', 'Ziua 2: Tipova + trasee', 'Ziua 3: Cetatea Soroca + oras'],
    href: '#rute-rapide',
  },
]

const perks: Perk[] = [
  {
    icon: 'fa-solid fa-money-bill-wave',
    title: 'Buget prietenos',
    description: 'Multe locuri faine fara costuri mari.',
  },
  {
    icon: 'fa-solid fa-people-group',
    title: 'Oameni primitori',
    description: 'Atmosfera calda si ospitalitate autentica.',
  },
  {
    icon: 'fa-solid fa-utensils',
    title: 'Bucatarie locala',
    description: 'Placinte, sarmale, zeama. Must try.',
  },
  {
    icon: 'fa-solid fa-wine-bottle',
    title: 'Vinarii legendare',
    description: 'Tururi, degustari si galerii subterane memorabile.',
  },
]

const checklist: ChecklistItem[] = [
  {
    title: 'Alege zona',
    description: 'Centru pentru mix cultural, Nistru pentru natura, nord pentru cetati.',
  },
  {
    title: 'Seteaza ritmul',
    description: '1-2 atractii principale pe zi iti pastreaza energia si bucuria.',
  },
  {
    title: 'Rezerva din timp',
    description: 'Vinariile si pensiunile populare se ocupa rapid in weekend.',
  },
  {
    title: 'Lasa loc de spontan',
    description: 'Cele mai bune opriri apar adesea intre punctele planificate.',
  },
]

const galleryItems: GalleryItem[] = [
  {
    id: 'galerie-sunset',
    title: 'Apus la Orhei',
    subtitle: 'Lumina calda schimba complet peisajul',
  },
  {
    id: 'galerie-vin',
    title: 'Seara la vinarie',
    subtitle: 'Tur, degustare si cina locala',
  },
  {
    id: 'galerie-nistru',
    title: 'Traseu pe Nistru',
    subtitle: 'Naturi salbatice si puncte foto superbe',
  },
]

const testimonials: Testimonial[] = [
  {
    quote: 'Am plecat pentru un weekend si am ramas impresionati de cat de multe poti vedea intr-un timp scurt.',
    author: 'Ana si Vlad, Iasi',
  },
  {
    quote: 'Tipova la rasarit si Cricova seara au fost combinatia perfecta pentru grupul nostru.',
    author: 'Radu, Bucuresti',
  },
  {
    quote: 'Moldova are un ritm calm, oameni calzi si experiente care chiar merita povestite.',
    author: 'Marta, Cluj',
  },
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 920) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Acasa">
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
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <i className="fa-solid fa-bars" aria-hidden="true"></i>
        </button>

        <nav id="site-nav" className={`site-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Navigare principala">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              className={`nav-link ${index === 0 ? 'active' : ''}`}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="container hero-content">
            <p className="hero-kicker">Natura | Vinarii | Manastiri | Istorie</p>
            <h1>Descopera Moldova, pas cu pas</h1>
            <p className="hero-subtitle">
              Idei de trasee, locuri faine si recomandari rapide pentru calatorii prin Moldova.
            </p>

            <div className="hero-actions">
              <a className="btn primary" href="#top-locuri">
                Vezi top locuri
              </a>
              <a className="btn ghost" href="#rute-rapide">
                Trasee 1-3 zile
              </a>
            </div>

            <div className="hero-badges" aria-label="Repere rapide">
              <div className="badge">
                <i className="fa-solid fa-mountain-sun" aria-hidden="true"></i>
                <span>Peisaje</span>
              </div>
              <div className="badge">
                <i className="fa-solid fa-wine-glass" aria-hidden="true"></i>
                <span>Vinarii</span>
              </div>
              <div className="badge">
                <i className="fa-solid fa-landmark" aria-hidden="true"></i>
                <span>Cultura</span>
              </div>
              <div className="badge">
                <i className="fa-solid fa-person-hiking" aria-hidden="true"></i>
                <span>Drumetii</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="top-locuri">
          <div className="container">
            <div className="section-head">
              <h2>Top locuri de vizitat</h2>
              <p>Alege din cele mai populare destinatii pentru o prima experienta in Moldova.</p>
            </div>

            <div className="grid cards">
              {topPlaces.map((place) => (
                <article className="card" key={place.id}>
                  <div
                    className={`card-media media-${place.id}`}
                    data-fallback={place.name}
                    role="img"
                    aria-label={place.name}
                  >
                    <span>{place.vibe}</span>
                  </div>
                  <div className="card-body">
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    <a className="card-link" href={place.href}>
                      Detalii <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt" id="rute-rapide">
          <div className="container">
            <div className="section-head">
              <h2>Rute rapide (1-3 zile)</h2>
              <p>Trei idei simple. Le poti pune pe harta si porni imediat.</p>
            </div>

            <div className="grid routes">
              {routeIdeas.map((route) => (
                <article className="route" key={route.title}>
                  <h3>
                    <i className={route.icon} aria-hidden="true"></i> {route.title}
                  </h3>
                  <ul>
                    {route.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <a className="btn small" href={route.href}>
                    Vezi ruta
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="ghid-rapid">
          <div className="container">
            <div className="section-head">
              <h2>Ghid rapid inainte de plecare</h2>
              <p>Un checklist compact care te ajuta sa organizezi un city-break fara stres.</p>
            </div>

            <div className="grid check-grid">
              {checklist.map((item, index) => (
                <article className="check-item" key={item.title}>
                  <span className="check-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

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

        <section className="section" id="de-ce">
          <div className="container">
            <div className="section-head">
              <h2>De ce merita Moldova?</h2>
              <p>Mica, dar plina de surprize. Perfecta pentru weekenduri.</p>
            </div>

            <div className="grid perks">
              {perks.map((perk) => (
                <div className="perk" key={perk.title}>
                  <i className={perk.icon} aria-hidden="true"></i>
                  <h3>{perk.title}</h3>
                  <p>{perk.description}</p>
                </div>
              ))}
            </div>

            <div className="testimonials" aria-label="Recomandari de la calatori">
              {testimonials.map((testimonial) => (
                <blockquote className="quote" key={testimonial.author}>
                  <p>{testimonial.quote}</p>
                  <cite>{testimonial.author}</cite>
                </blockquote>
              ))}
            </div>

            <div className="cta" id="contact">
              <div className="cta-text">
                <h3>Vrei sa-ti facem un itinerar?</h3>
                <p>Scrie-ne ce preferi (natura / vin / istorie) si cate zile ai.</p>
              </div>
              <a className="btn primary" href="mailto:contact@moldovatravel.md">
                Contacteaza-ne
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <strong>Moldova Travel</strong>
            <div className="muted">{currentYear} | Calatoreste local, traieste autentic</div>
          </div>

          <div className="footer-right" aria-label="Social media">
            <a
              className="social"
              href="https://www.instagram.com/explore/tags/moldovatravel/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              className="social"
              href="https://www.facebook.com/search/top?q=moldova%20travel"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook" aria-hidden="true"></i>
            </a>
            <a
              className="social"
              href="https://www.youtube.com/results?search_query=moldova+travel"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
