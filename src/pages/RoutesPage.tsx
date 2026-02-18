import { useMemo, useState } from "react";
import { RoutesHero } from "../components/routes/RoutesHero";
import { RoutesList } from "../components/routes/RoutesList";
import { RoutesMap } from "../components/routes/RoutesMap";
import { ROUTES_CATALOG } from "../data/routes/routesCatalog";
import type { RouteFilter } from "../types/routes";

export default function RoutesPage() {
  const [activeFilter, setActiveFilter] = useState<RouteFilter>("toate");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const filteredRoutes = useMemo(() => {
    return ROUTES_CATALOG.filter((route) => activeFilter === "toate" || route.category === activeFilter);
  }, [activeFilter]);

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
            expandedDetails={expandedDetails}
            onFilterChange={setActiveFilter}
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
