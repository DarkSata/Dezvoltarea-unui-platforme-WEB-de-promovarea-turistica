import type { ContactDetail } from "../../types/contact";

type ContactDetailsProps = {
  details: ContactDetail[];
};

export function ContactDetails({ details }: ContactDetailsProps) {
  return (
    <article className="card contact-card">
      <div className="card-body">
        <h3>Date de contact</h3>
        <p className="muted">Ne poti contacta direct pe oricare dintre canalele de mai jos.</p>

        <ul className="contact-list">
          {details.map((item) => (
            <li key={item.id} className="contact-item">
              <i className={item.icon} aria-hidden="true"></i>
              <div>
                <strong>{item.label}</strong>
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {item.value}
                </a>
                {item.note ? <span className="muted">{item.note}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
