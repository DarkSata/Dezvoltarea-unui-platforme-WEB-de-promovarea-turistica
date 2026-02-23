import type { FaqItem } from "../../types/contact";

type ContactFaqProps = {
  items: FaqItem[];
};

export function ContactFaq({ items }: ContactFaqProps) {
  const itemsByCategory = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head">
          <h2>Intrebari frecvente</h2>
          <p>Raspunsuri rapide pentru cele mai comune intrebari legate de planificarea unei rute turistice.</p>
        </div>

        {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => (
          <div className="faq-list" key={category}>
            <h3>{category}</h3>
            {categoryItems.map((item, itemIndex) => (
              <details className="faq-item" key={item.id} open={categoryIndex === 0 && itemIndex === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
