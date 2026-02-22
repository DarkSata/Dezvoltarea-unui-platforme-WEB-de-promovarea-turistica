import { useMemo, useState } from "react";
import { RoutesHero } from "../components/routes/RoutesHero";
import { RoutesList } from "../components/routes/RoutesList";
import { RoutesMap } from "../components/routes/RoutesMap";
import { ROUTES_CATALOG } from "../data/routes/routesCatalog";
import type { RouteDurationFilter, RouteFilter } from "../types/routes";

export default function RoutesPage() {
  const [activeFilter, setActiveFilter] = useState<RouteFilter>("toate");
  const [activeDurationFilter, setActiveDurationFilter] = useState<RouteDurationFilter>("toate");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const filteredRoutes = useMemo(() => {
    return ROUTES_CATALOG.filter((route) => {
      const byCategory = activeFilter === "toate" || route.category === activeFilter;
      const byDuration =
        activeDurationFilter === "toate" || route.durationDays === activeDurationFilter;

      return byCategory && byDuration;
    });
  }, [activeDurationFilter, activeFilter]);

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return filteredRoutes.find((route) => route.id === selectedRouteId) ?? null;
  }, [filteredRoutes, selectedRouteId]);

  return (
    <>
      <RoutesHero />

      <section className="section">
        <div className="container destinations-layout">
          <RoutesList
            routes={filteredRoutes}
            activeFilter={activeFilter}
            activeDurationFilter={activeDurationFilter}
            expandedDetails={expandedDetails}
            onFilterChange={setActiveFilter}
            onDurationFilterChange={setActiveDurationFilter}
            onToggleDetails={(id) => {
              setExpandedDetails((current) => ({ ...current, [id]: !current[id] }));
            }}
            onShowRoute={setSelectedRouteId}
          />

          <RoutesMap selectedRoute={selectedRoute} />
        </div>
      </section>
    </>
  );
}
