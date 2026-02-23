import type { ContactDetail, FaqItem, OfficeLocation, SocialLink } from "../../types/contact";

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    id: "address",
    label: "Adresa",
    value: "Stefan cel Mare si Sfant Boulevard 83, MD-2012",
    href: "https://www.google.com/maps/dir/?api=1&destination=Tourist+Information+Center%2C+Stefan+cel+Mare+si+Sfant+Boulevard+83%2C+MD-2012%2C+Chi%C8%99in%C4%83u%2C+Moldova&utm_source=chatgpt.com",
    icon: "fa-solid fa-location-dot",
    note: "Chisinau, Moldova",
  },
  {
    id: "phone",
    label: "Telefon",
    value: "+373 22 555 700",
    href: "tel:+37322555700",
    icon: "fa-solid fa-phone",
    note: "Luni - Vineri, 09:00 - 18:00",
  },
  {
    id: "email",
    label: "Email",
    value: "contact@moldovatravel.md",
    href: "mailto:contact@moldovatravel.md",
    icon: "fa-solid fa-envelope",
    note: "Raspundem in max. 24h",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/explore/tags/moldovatravel/",
    icon: "fa-brands fa-instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/search/top?q=moldova%20travel",
    icon: "fa-brands fa-facebook-f",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/search?q=moldova%20travel",
    icon: "fa-brands fa-tiktok",
  },
];

export const CONTACT_FAQ: FaqItem[] = [
  {
    id: "reserve-tour",
    category: "Planificare si rezervari",
    question: "Cum pot rezerva un tur?",
    answer:
      "Poti rezerva direct din pagina Rute sau contactandu-ne prin formularul de contact.",
  },
  {
    id: "reserve-early",
    category: "Planificare si rezervari",
    question: "Trebuie sa rezerv din timp?",
    answer:
      "Da, este recomandat sa rezervi din timp, mai ales in weekend sau in sezonul turistic.",
  },
  {
    id: "modify-booking",
    category: "Planificare si rezervari",
    question: "Pot modifica rezervarea?",
    answer:
      "Da, rezervarile pot fi modificate in limita disponibilitatii, cu cel putin 24 de ore inainte.",
  },
  {
    id: "attractions-cost",
    category: "Costuri si plati",
    question: "Vizitarea atractiilor este gratuita?",
    answer: "Unele atractii sunt gratuite, insa vinariile si muzeele pot percepe taxe de intrare.",
  },
  {
    id: "payment-options",
    category: "Costuri si plati",
    question: "Cum pot plati?",
    answer: "Plata se poate face in numerar sau cu cardul, in functie de locatie.",
  },
  {
    id: "group-discount",
    category: "Costuri si plati",
    question: "Exista reduceri pentru grupuri?",
    answer: "Da, pentru grupurile mai mari pot fi oferite reduceri.",
  },
  {
    id: "arrive-destinations",
    category: "Transport",
    question: "Cum ajung la destinatii?",
    answer: "Poti ajunge folosind transportul public, taxi sau masina personala.",
  },
  {
    id: "rent-car",
    category: "Transport",
    question: "Este recomandat sa inchiriez o masina?",
    answer: "Da, ofera flexibilitate si acces mai usor la destinatii.",
  },
  {
    id: "organized-transport",
    category: "Transport",
    question: "Exista transport organizat?",
    answer: "Pentru anumite rute exista transport organizat, in functie de oferta.",
  },
  {
    id: "where-stay",
    category: "Cazare",
    question: "Unde pot gasi cazare?",
    answer: "In Chisinau si zonele turistice exista hoteluri si pensiuni pentru turisti.",
  },
  {
    id: "book-stay-early",
    category: "Cazare",
    question: "Trebuie sa rezerv cazarea din timp?",
    answer: "Da, mai ales in perioadele aglomerate.",
  },
  {
    id: "winery-booking",
    category: "Experiente turistice",
    question: "Este necesara programarea la vinarii?",
    answer: "Da, majoritatea vinariilor necesita rezervare in avans.",
  },
  {
    id: "winery-duration",
    category: "Experiente turistice",
    question: "Cat dureaza o vizita la o vinarie?",
    answer: "In medie intre una si doua ore.",
  },
  {
    id: "language",
    category: "Informatii generale",
    question: "Ce limba se vorbeste in Moldova?",
    answer: "Limba oficiala este romana, dar se vorbeste si rusa sau engleza.",
  },
  {
    id: "safety",
    category: "Informatii generale",
    question: "Este sigur sa calatoresc in Moldova?",
    answer: "Da, este o destinatie sigura pentru turisti.",
  },
  {
    id: "mobile-internet",
    category: "Informatii generale",
    question: "Am nevoie de internet mobil?",
    answer: "Este recomandat, dar Wi-Fi este disponibil in majoritatea locatiilor.",
  },
  {
    id: "visit-days",
    category: "Organizare",
    question: "Cate zile sunt suficiente pentru o vizita?",
    answer: "Doua pana la patru zile sunt suficiente pentru principalele atractii.",
  },
  {
    id: "best-season",
    category: "Organizare",
    question: "Care este cea mai buna perioada pentru vizita?",
    answer: "Primavara si toamna sunt cele mai potrivite.",
  },
  {
    id: "fast-contact",
    category: "Suport",
    question: "Cum va pot contacta rapid?",
    answer: "Prin formularul de pe site sau telefonic.",
  },
  {
    id: "foreign-support",
    category: "Suport",
    question: "Oferiti suport pentru turisti straini?",
    answer: "Da, oferim suport in mai multe limbi.",
  },
];

export const CONTACT_OFFICE: OfficeLocation = {
  name: "Moldova Travel Hub",
  address: "Stefan cel Mare si Sfant Boulevard 83, MD-2012",
  city: "Chisinau",
  schedule: "Luni - Vineri, 09:00 - 18:00",
  lat: 47.0227436,
  lng: 28.8346432,
};
