type GuideCard = {
  title: string;
  description: string;
};

type GuideSection = {
  title: string;
  description: string;
  cards: GuideCard[];
};

const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "Transport și itinerarii recomandate",
    description:
      "Poți ajunge în Moldova cu avionul, trenul, autobuzul sau mașina. Am păstrat aici opțiuni simple pentru deplasare și trasee ușor de urmat.",
    cards: [
      {
        title: "Cum să ajungeți în Moldova",
        description:
          "Conexiuni din Europa, variante de transfer și recomandări pentru sosirea fără stres.",
      },
      {
        title: "Transportul în Moldova",
        description:
          "Informații utile despre transport public, mașină închiriată și șofer privat.",
      },
      {
        title: "Itinerarii și rute",
        description:
          "Rute de 1-3 zile care combină orașe, vinării, natură și obiective culturale.",
      },
    ],
  },
  {
    title: "Cazare și hoteluri în Moldova",
    description:
      "De la hoteluri urbane la pensiuni rurale, ai opțiuni pentru orice buget și stil de călătorie.",
    cards: [
      {
        title: "Hoteluri în Chișinău",
        description:
          "Selectează ușor zona potrivită, nivelul de confort și tipul de servicii dorite.",
      },
      {
        title: "Pensiuni turistice",
        description:
          "Locații autentice, ospitalitate locală și experiențe relaxate aproape de natură.",
      },
    ],
  },
  {
    title: "Detalii practice de călătorie și informații utile",
    description:
      "Am centralizat cele mai importante lucruri de știut înainte de plecare: documente, buget, sezon și sfaturi locale.",
    cards: [
      {
        title: "Detalii practice de călătorie",
        description:
          "Vize, vamă, valută și alte informații de bază pentru o planificare corectă.",
      },
      {
        title: "Informații despre Moldova",
        description:
          "Context despre regiuni, specific local, tradiții și diferențe între zone turistice.",
      },
      {
        title: "Patrimoniu cultural și tradiții",
        description:
          "Evenimente, festivaluri și obiceiuri care te ajută să înțelegi mai bine cultura locală.",
      },
    ],
  },
  {
    title: "Agenții locale, ghizi și servicii de suport",
    description:
      "Dacă preferi ajutor local, poți colabora cu agenții sau ghizi pentru itinerarii personalizate.",
    cards: [
      {
        title: "Agenții și tur operatori locali",
        description:
          "Pachete flexibile, logistică simplificată și suport pentru organizarea completă.",
      },
      {
        title: "Găsește un ghid turistic local",
        description:
          "Tururi tematice pentru istorie, natură, gastronomie sau experiențe culturale.",
      },
    ],
  },
];

export default function TravelerGuidePage() {
  return (
    <section className="section traveler-guide-page">
      <div className="container">
        <div className="section-head traveler-guide-head">
          <h1>Ghidul călătorului</h1>
          <p>
            Aici găsești, într-un format simplu, informațiile esențiale pentru o vizită în Moldova.
            Cardurile de mai jos păstrează structura ghidului, iar imaginile pot fi adăugate ulterior.
          </p>
        </div>

        <div className="traveler-guide-sections">
          {GUIDE_SECTIONS.map((section) => (
            <article className="traveler-guide-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>

              <div className="traveler-guide-grid">
                {section.cards.map((card) => (
                  <article className="traveler-guide-card" key={card.title}>
                    <div className="traveler-guide-frame" aria-hidden="true">
                      cadru imagine
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
