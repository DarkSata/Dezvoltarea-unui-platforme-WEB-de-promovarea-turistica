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
    question: "Cum pot rezerva un tur?",
    answer:
      "Ne scrii pe formularul de contact sau la telefon, iar noi revenim cu variante de rute in functie de zile, buget si interese.",
  },
  {
    id: "is-free",
    question: "Este gratuita vizitarea?",
    answer:
      "Unele obiective sunt gratuite, altele au bilet de intrare. Iti trimitem estimari clare pentru fiecare oprire din ruta.",
  },
  {
    id: "group-support",
    question: "Oferiti suport pentru grupuri?",
    answer:
      "Da. Putem pregati recomandari pentru grupuri mici, corporate trips sau itinerare pentru ghizi independenti.",
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
