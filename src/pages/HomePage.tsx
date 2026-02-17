import { HeroSection } from "../sections/HeroSection";
import { TopPlacesSection } from "../sections/TopPlacesSection";
import { RoutesSection } from "../sections/RoutesSection";
import { GuideSection } from "../sections/GuideSection";
import { GallerySection } from "../sections/GallerySection";
import { PerksSection } from "../sections/PerksSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TopPlacesSection />
      <RoutesSection />
      <GuideSection />
      <GallerySection />
      <PerksSection />
    </>
  );
}
