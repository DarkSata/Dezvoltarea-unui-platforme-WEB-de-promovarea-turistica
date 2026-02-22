import type { FaqItem } from "../../types/contact";

type ContactFaqProps = {
  items: FaqItem[];
};

export function ContactFaq({ items }: ContactFaqProps) {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head">
          <h2>Intrebari frecvente</h2>
          <p>Raspunsuri rapide pentru cele mai comune intrebari legate de planificarea unei rute turistice.</p>
        </div>

        <div className="faq-list">
          {items.map((item, index) => (
            <details className="faq-item" key={item.id} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
