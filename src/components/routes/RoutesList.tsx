import Empty from "../Empty";
import { RouteCard } from "./RouteCard";
import { RoutesFilters } from "./RoutesFilters";
import { RoutesInfoCard } from "./RoutesInfoCard";
import type { RouteDurationFilter, RouteFilter, TouristRoute } from "../../types/routes";

type Props = {
  routes: TouristRoute[];
  activeFilter: RouteFilter;
  activeDurationFilter: RouteDurationFilter;
  expandedDetails: Record<string, boolean>;
  onFilterChange: (filter: RouteFilter) => void;
  onDurationFilterChange: (filter: RouteDurationFilter) => void;
  onToggleDetails: (id: string) => void;
  onShowRoute: (id: string) => void;
};

export function RoutesList({
  routes,
  activeFilter,
  activeDurationFilter,
  expandedDetails,
  onFilterChange,
  onDurationFilterChange,
  onToggleDetails,
  onShowRoute,
}: Props) {
  return (
    <div className="destinations-list">
      <RoutesFilters
        activeFilter={activeFilter}
        activeDurationFilter={activeDurationFilter}
        onFilterChange={onFilterChange}
        onDurationFilterChange={onDurationFilterChange}
      />

      <div className="destinations-meta">
        <strong>Rute disponibile</strong>
        <span className="muted">
          <span>{routes.length}</span> trasee
        </span>
      </div>

      {routes.length === 0 ? (
        <Empty
          title="Nicio rut\u0103 pentru filtrele alese"
          description="Schimb\u0103 categoria sau durata pentru a vedea alte trasee."
        />
      ) : (
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
      )}

      <RoutesInfoCard />
    </div>
  );
}


