import { useEffect, useState } from 'react'
import type { NavLink } from '../types/nav'

type SiteHeaderProps = {
  navLinks: NavLink[]
  activeLabel: string
  brandHref: string
  breakpoint?: number
}

export function SiteHeader({ navLinks, activeLabel, brandHref, breakpoint = 920 }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > breakpoint) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return (
    <header className="site-header">
      <a className="brand" href={brandHref} aria-label="Acasă">
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

      <nav id="site-nav" className={`site-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Navigare principală">
        {navLinks.map((link) => (
          <a
            key={link.label}
            className={`nav-link ${link.label === activeLabel ? 'active' : ''}`}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
