import { ROUTE_FILTERS } from "../../data/routes/routesCatalog";
import type { RouteFilter } from "../../types/routes";

type Props = {
  activeFilter: RouteFilter;
  onFilterChange: (filter: RouteFilter) => void;
};

export function RoutesFilters({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="destinations-toolbar" aria-label="Filtru rute">
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
    </div>
  );
}
