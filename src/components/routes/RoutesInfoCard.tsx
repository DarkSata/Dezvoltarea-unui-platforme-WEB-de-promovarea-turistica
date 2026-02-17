export function RoutesInfoCard() {
  return (
    <article className="card route-info-card">
      <div className="card-body">
        <h3>
          <i className="fa-solid fa-circle-info" aria-hidden="true"></i> Informații utile înainte de
          plecare
        </h3>

        <ul className="route-info-list">
          <li>Verifică prognoza meteo și adaptează ruta la sezon.</li>
          <li>Pentru drumeție: încălțăminte comodă, apă, haine în straturi.</li>
          <li>Pentru ciclism: cască, lumini, kit simplu (cameră/mini-pompă).</li>
          <li>Pentru auto: planifică opriri și ai grijă la drumurile locale.</li>
          <li>Respectă natura și comunitățile locale (nu lăsa deșeuri).</li>
        </ul>

        <div className="cta">
          <div className="cta-text">
            <h3>Ai o idee de traseu?</h3>
            <p>Trimite-ne propunerea ta și o adăugăm în listă.</p>
          </div>
          <button className="btn primary" type="button">
            Propune un traseu
          </button>
        </div>
      </div>
    </article>
  );
}
