import { ROUTE_DURATION_FILTERS, ROUTE_FILTERS } from "../../data/routes/routesCatalog";
import type { RouteDurationFilter, RouteFilter } from "../../types/routes";

type Props = {
  activeFilter: RouteFilter;
  activeDurationFilter: RouteDurationFilter;
  onFilterChange: (filter: RouteFilter) => void;
  onDurationFilterChange: (filter: RouteDurationFilter) => void;
};

export function RoutesFilters({
  activeFilter,
  activeDurationFilter,
  onFilterChange,
  onDurationFilterChange,
}: Props) {
  return (
    <div className="destinations-toolbar routes-filters" aria-label="Filtru rute">
      <div className="chips" role="group" aria-label="Filtre categorie rute">
        {ROUTE_FILTERS.map((item) => (
          <button
            key={item.key}
            className={`chip ${activeFilter === item.key ? "active" : ""}`}
            type="button"
            onClick={() => onFilterChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="chips" role="group" aria-label="Filtre durata rute">
        {ROUTE_DURATION_FILTERS.map((item) => (
          <button
            key={`duration-${item.key}`}
            className={`chip ${activeDurationFilter === item.key ? "active" : ""}`}
            type="button"
            onClick={() => onDurationFilterChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
