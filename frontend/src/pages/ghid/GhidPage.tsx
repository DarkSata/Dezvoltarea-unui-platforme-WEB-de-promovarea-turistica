import { GhidAvoidSection } from "./sections/GhidAvoidSection";
import { GhidBeforeDepartureSection } from "./sections/GhidBeforeDepartureSection";
import { GhidFinalCtaSection } from "./sections/GhidFinalCtaSection";
import { GhidGastronomySection } from "./sections/GhidGastronomySection";
import { GhidHeroSection } from "./sections/GhidHeroSection";
import { GhidItinerariesSection } from "./sections/GhidItinerariesSection";
import { GhidPlanningSection } from "./sections/GhidPlanningSection";
import { GhidQuickNavSection } from "./sections/GhidQuickNavSection";
import { GhidTipsSection } from "./sections/GhidTipsSection";
import { GhidTransportSection } from "./sections/GhidTransportSection";
import { GhidWhatToVisitSection } from "./sections/GhidWhatToVisitSection";

export default function GhidPage() {
  return (
    <div className="guide-page">
      <GhidHeroSection />
      <GhidQuickNavSection />
      <GhidBeforeDepartureSection />
      <GhidPlanningSection />
      <GhidTransportSection />
      <GhidWhatToVisitSection />
      <GhidGastronomySection />
      <GhidTipsSection />
      <GhidAvoidSection />
      <GhidItinerariesSection />
      <GhidFinalCtaSection />
    </div>
  );
}
