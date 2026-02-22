import type { SocialLink } from "../../types/contact";

type ContactSocialLinksProps = {
  links: SocialLink[];
};

export function ContactSocialLinks({ links }: ContactSocialLinksProps) {
  return (
    <article className="card contact-card">
      <div className="card-body">
        <h3>Social media</h3>
        <p className="muted">Urmareste noutatile, traseele sezoniere si ideile de weekend.</p>

        <div className="contact-socials" aria-label="Canale social media">
          {links.map((item) => (
            <div key={item.id} className="contact-social-item">
              <a
                className="social contact-social"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
              >
                <i className={item.icon} aria-hidden="true"></i>
              </a>
              <span className="contact-social-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
