import type { TouristRoute } from "../../types/routes";

type Props = {
  route: TouristRoute;
  detailsOpen: boolean;
  onToggleDetails: (id: string) => void;
  onShowRoute: (id: string) => void;
};

export function RouteCard({ route, detailsOpen, onToggleDetails, onShowRoute }: Props) {
  return (
    <article className="card route-card" data-route={route.id} data-cat={route.category}>
      <div className="card-body">
        <h3>{route.title}</h3>
        <p>{route.subtitle}</p>

        <div className="dest-row">
          {route.topPills.map((pill) => (
            <span className="pill" key={`${route.id}-${pill.icon}-${pill.label}`}>
              <i className={pill.icon} aria-hidden="true"></i> {pill.label}
            </span>
          ))}
        </div>

        <div className="dest-row bottom">
          {route.bottomPills.map((pill) => (
            <span className="pill" key={`${route.id}-${pill.icon}-${pill.label}`}>
              <i className={pill.icon} aria-hidden="true"></i> {pill.label}
            </span>
          ))}
        </div>

        <button
          className="btn small ghost toggle-details"
          type="button"
          onClick={() => onToggleDetails(route.id)}
        >
          {detailsOpen ? "Ascunde detalii" : "Detalii traseu"}
        </button>
        <button className="btn small dest-btn" type="button" onClick={() => onShowRoute(route.id)}>
          Vezi rută
        </button>

        <div className={`route-details ${detailsOpen ? "open" : ""}`}>
          <p>{route.details}</p>
        </div>
      </div>
    </article>
  );
}
