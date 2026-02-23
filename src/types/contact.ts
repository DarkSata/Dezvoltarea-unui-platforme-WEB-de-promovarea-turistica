export type ContactDetail = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: string;
  note?: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type OfficeLocation = {
  name: string;
  address: string;
  city: string;
  schedule: string;
  lat: number;
  lng: number;
};
