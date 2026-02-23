import { ContactDetails } from "../components/contact/ContactDetails";
import { ContactFaq } from "../components/contact/ContactFaq";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactMap } from "../components/contact/ContactMap";
import { ContactSocialLinks } from "../components/contact/ContactSocialLinks";
import { CONTACT_DETAILS, CONTACT_FAQ, CONTACT_OFFICE, SOCIAL_LINKS } from "../data/contact/contactContent";

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="hero-kicker">Contact Moldova Travel</p>
          <h1>Suntem aici sa te ajutam sa descoperi Moldova</h1>
          <p className="hero-subtitle">
            Contacteaza-ne pentru cele mai bune rute turistice, recomandari locale si planuri de calatorie adaptate
            programului tau.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-stack">
            <ContactDetails details={CONTACT_DETAILS} />
            <ContactSocialLinks links={SOCIAL_LINKS} />
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContactMap office={CONTACT_OFFICE} />
          <article className="card cta-banner">
            <div className="card-body cta-banner-body">
              <div>
                <h3>Vrei o ruta personalizata pentru weekend?</h3>
                <p className="muted">
                  Scrie-ne cate zile ai disponibile si ce tip de experienta preferi: natura, vinarii sau istorie.
                </p>
              </div>
              <a className="btn primary" href="mailto:contact@moldovatravel.md">
                Contacteaza-ne acum
              </a>
            </div>
          </article>
        </div>
      </section>

      <ContactFaq items={CONTACT_FAQ} />
    </>
  );
}
