import { RouteCard } from "./RouteCard";
import { RoutesFilters } from "./RoutesFilters";
import { RoutesInfoCard } from "./RoutesInfoCard";
import type { RouteFilter, TouristRoute } from "../../types/routes";

type Props = {
  routes: TouristRoute[];
  activeFilter: RouteFilter;
  expandedDetails: Record<string, boolean>;
  onFilterChange: (filter: RouteFilter) => void;
  onToggleDetails: (id: string) => void;
  onShowRoute: (id: string) => void;
};

export function RoutesList({
  routes,
  activeFilter,
  expandedDetails,
  onFilterChange,
  onToggleDetails,
  onShowRoute,
}: Props) {
  return (
    <div className="destinations-list">
      <RoutesFilters activeFilter={activeFilter} onFilterChange={onFilterChange} />

      <div className="destinations-meta">
        <strong>Rute disponibile</strong>
        <span className="muted">
          <span>{routes.length}</span> trasee
        </span>
      </div>

      <div className="grid destinations-cards">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            detailsOpen={Boolean(expandedDetails[route.id])}
            onToggleDetails={onToggleDetails}
            onShowRoute={onShowRoute}
          />
        ))}
      </div>

      <RoutesInfoCard />
    </div>
  );
}
