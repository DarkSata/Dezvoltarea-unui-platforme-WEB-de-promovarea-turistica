import { useEffect, useState } from "react";
import { ContactDetails } from "../components/contact/ContactDetails";
import { ContactFaq } from "../components/contact/ContactFaq";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactMap } from "../components/contact/ContactMap";
import { ContactSocialLinks } from "../components/contact/ContactSocialLinks";
import { contactService } from "../services/contactService";
import { CONTACT_DETAILS, CONTACT_FAQ, CONTACT_OFFICE, SOCIAL_LINKS } from "../data/contact/contactContent";
import type { ContactDetail, FaqItem, OfficeLocation, SocialLink } from "../types/contact";

type ContactState = {
  details: ContactDetail[];
  socials: SocialLink[];
  faq: FaqItem[];
  office: OfficeLocation;
};

export default function ContactPage() {
  const [content, setContent] = useState<ContactState>({
    details: CONTACT_DETAILS,
    socials: SOCIAL_LINKS,
    faq: CONTACT_FAQ,
    office: CONTACT_OFFICE,
  });

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      try {
        const data = await contactService.getContent();
        if (!mounted) return;
        setContent({
          details: data.details,
          socials: data.socials,
          faq: data.faq,
          office: data.office,
        });
      } catch {
        // fallback stays as static content
      }
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

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
            <ContactDetails details={content.details} />
            <ContactSocialLinks links={content.socials} />
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContactMap office={content.office} />
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

      <ContactFaq items={content.faq} />
    </>
  );
}
