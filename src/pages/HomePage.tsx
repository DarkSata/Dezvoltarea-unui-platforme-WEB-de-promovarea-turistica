import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { navLinks } from '../data/home/navLinks'
import { HeroSection } from '../sections/HeroSection'
import { TopPlacesSection } from '../sections/TopPlacesSection'
import { RoutesSection } from '../sections/RoutesSection'
import { GuideSection } from '../sections/GuideSection'
import { GallerySection } from '../sections/GallerySection'
import { PerksSection } from '../sections/PerksSection'

type HomePageProps = {
  activeLabel: string
  yearText: string
}

export function HomePage({ activeLabel, yearText }: HomePageProps) {
  return (
    <div className="app-shell">
      <SiteHeader navLinks={navLinks} activeLabel={activeLabel} brandHref="#/" />
      <main>
        <HeroSection />
        <TopPlacesSection />
        <RoutesSection />
        <GuideSection />
        <GallerySection />
        <PerksSection />
      </main>
      <SiteFooter yearText={yearText} showTagline />
    </div>
  )
}
