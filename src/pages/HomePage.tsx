import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "../sections/HeroSection";
import { TopPlacesSection } from "../sections/TopPlacesSection";
import { RoutesSection } from "../sections/RoutesSection";
import { GuideSection } from "../sections/GuideSection";
import { GallerySection } from "../sections/GallerySection";
import { PerksSection } from "../sections/PerksSection";
import { scrollToId } from "../utils/scroll";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.hash.replace(/^#/, "");
    if (!sectionId) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToId(sectionId);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.hash]);

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
