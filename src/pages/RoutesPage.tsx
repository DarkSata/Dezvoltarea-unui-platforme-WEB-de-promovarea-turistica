import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorState from "../components/Error";
import Loading from "../components/Loading";
import { RoutesHero } from "../components/routes/RoutesHero";
import { RoutesList } from "../components/routes/RoutesList";
import { RoutesMap } from "../components/routes/RoutesMap";
import { routesService } from "../services/routesService";
import type { RouteDurationFilter, RouteFilter, TouristRoute } from "../types/routes";

export default function RoutesPage() {
  const [searchParams] = useSearchParams();

  const [routes, setRoutes] = useState<TouristRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<RouteFilter>("toate");
  const [activeDurationFilter, setActiveDurationFilter] = useState<RouteDurationFilter>("toate");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    async function loadRoutes() {
      setLoading(true);
      setError(null);

      try {
        const items = await routesService.list();
        if (!mounted) return;
        setRoutes(items);
      } catch {
        if (!mounted) return;
        setError("Nu am putut încărca rutele.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadRoutes();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const routeId = searchParams.get("route");
    if (!routeId) return;

    const targetRoute = routes.find((route) => route.id === routeId);
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
  }, [routes, searchParams]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const byCategory = activeFilter === "toate" || route.category === activeFilter;
      const byDuration =
        activeDurationFilter === "toate" || route.durationDays === activeDurationFilter;

      return byCategory && byDuration;
    });
  }, [activeDurationFilter, activeFilter, routes]);

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return filteredRoutes.find((route) => route.id === selectedRouteId) ?? null;
  }, [filteredRoutes, selectedRouteId]);

  return (
    <>
      <RoutesHero />

      <section className="section">
        <div className="container">
          {loading ? <Loading text="Se încarcă rutele..." /> : null}
          {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}

          {!loading && !error ? (
            <div className="destinations-layout">
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
          ) : null}
        </div>
      </section>
    </>
  );
}
