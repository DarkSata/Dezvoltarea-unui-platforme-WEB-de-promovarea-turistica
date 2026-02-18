import { routeIdeas } from '../data/home/routeIdeas'

export function RoutesSection() {
  return (
    <section className="section alt" id="rute-rapide">
      <div className="container">
        <div className="section-head">
          <h2>Rute rapide (1-3 zile)</h2>
          <p>Trei idei simple. Le poți pune pe hartă și porni imediat.</p>
        </div>

        <div className="grid routes">
          {routeIdeas.map((route) => (
            <article className="route" key={route.title}>
              <h3><i className={route.icon} aria-hidden="true"></i> {route.title}</h3>
              <ul>{route.points.map((point) => <li key={point}>{point}</li>)}</ul>
              <a className="btn small" href="#/rute-rapide">Vezi rută</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
