import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RoutesHero } from "../components/routes/RoutesHero";
import { RoutesList } from "../components/routes/RoutesList";
import { RoutesMap } from "../components/routes/RoutesMap";
import { ROUTES_CATALOG } from "../data/routes/routesCatalog";
import type { RouteDurationFilter, RouteFilter } from "../types/routes";

export default function RoutesPage() {
  const [searchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<RouteFilter>("toate");
  const [activeDurationFilter, setActiveDurationFilter] = useState<RouteDurationFilter>("toate");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const routeId = searchParams.get("route");
    if (!routeId) return;

    const targetRoute = ROUTES_CATALOG.find((route) => route.id === routeId);
    if (!targetRoute) return;

    setActiveFilter(targetRoute.category);
    setActiveDurationFilter(targetRoute.durationDays);
    setSelectedRouteId(targetRoute.id);
    setExpandedDetails((current) => ({ ...current, [targetRoute.id]: true }));

    const frameId = window.requestAnimationFrame(() => {
      const card = document.querySelector(`[data-route="${targetRoute.id}"]`);
      if (card instanceof HTMLElement) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [searchParams]);

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
