import { Link } from 'react-router-dom'
import { routeIdeas } from '../data/home/routeIdeas'

export function RoutesSection() {
  return (
    <section className="section alt" id="rute-rapide">
      <div className="container">
        <div className="section-head">
          <h2>Rute rapide (1-3 zile)</h2>
          <p>Trei idei simple. Le poți deschide direct pe harta din pagina de rute.</p>
        </div>

        <div className="grid routes quick-routes-grid">
          {routeIdeas.map((route) => (
            <article className="route quick-route-card" key={route.routeId}>
              <h3><i className={route.icon} aria-hidden="true"></i> {route.title}</h3>
              <ul>{route.points.map((point) => <li key={point}>{point}</li>)}</ul>
              <Link className="btn small" to={`/routes?route=${encodeURIComponent(route.routeId)}`}>
                Vezi rută
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
