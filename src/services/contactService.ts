import {
  CONTACT_DETAILS,
  CONTACT_FAQ,
  CONTACT_OFFICE,
  SOCIAL_LINKS,
} from "../data/contact/contactContent";
import type { ContactDetail, FaqItem, OfficeLocation, SocialLink } from "../types/contact";

const STORAGE_KEY = "moldova-travel.contact-content";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

export type ContactDetailInput = Omit<ContactDetail, "id">;
export type SocialLinkInput = Omit<SocialLink, "id">;
export type FaqItemInput = Omit<FaqItem, "id">;
export type OfficeLocationInput = OfficeLocation;

export type ContactContentData = {
  details: ContactDetail[];
  socials: SocialLink[];
  faq: FaqItem[];
  office: OfficeLocation;
};

const SEED: ContactContentData = {
  details: CONTACT_DETAILS,
  socials: SOCIAL_LINKS,
  faq: CONTACT_FAQ,
  office: CONTACT_OFFICE,
};

function normalizeDetails(value: unknown): ContactDetail[] {
  if (!Array.isArray(value)) return SEED.details;

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item, index) => {
      const current = item as Partial<ContactDetail>;
      return {
        id: typeof current.id === "string" && current.id.trim() ? current.id : `detail-${index + 1}`,
        label: typeof current.label === "string" ? current.label : "",
        value: typeof current.value === "string" ? current.value : "",
        href: typeof current.href === "string" ? current.href : "",
        icon: typeof current.icon === "string" ? current.icon : "fa-solid fa-circle-info",
        note: typeof current.note === "string" && current.note.trim() ? current.note : undefined,
      };
    });
}

function normalizeSocials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return SEED.socials;

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item, index) => {
      const current = item as Partial<SocialLink>;
      return {
        id: typeof current.id === "string" && current.id.trim() ? current.id : `social-${index + 1}`,
        label: typeof current.label === "string" ? current.label : "",
        href: typeof current.href === "string" ? current.href : "",
        icon: typeof current.icon === "string" ? current.icon : "fa-brands fa-linkedin-in",
      };
    });
}

function normalizeFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return SEED.faq;

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item, index) => {
      const current = item as Partial<FaqItem>;
      return {
        id: typeof current.id === "string" && current.id.trim() ? current.id : `faq-${index + 1}`,
        category: typeof current.category === "string" ? current.category : "General",
        question: typeof current.question === "string" ? current.question : "",
        answer: typeof current.answer === "string" ? current.answer : "",
      };
    });
}

function normalizeOffice(value: unknown): OfficeLocation {
  if (typeof value !== "object" || value === null) return SEED.office;

  const current = value as Partial<OfficeLocation>;
  return {
    name: typeof current.name === "string" && current.name.trim() ? current.name : SEED.office.name,
    address:
      typeof current.address === "string" && current.address.trim()
        ? current.address
        : SEED.office.address,
    city: typeof current.city === "string" && current.city.trim() ? current.city : SEED.office.city,
    schedule:
      typeof current.schedule === "string" && current.schedule.trim()
        ? current.schedule
        : SEED.office.schedule,
    lat: typeof current.lat === "number" && Number.isFinite(current.lat) ? current.lat : SEED.office.lat,
    lng: typeof current.lng === "number" && Number.isFinite(current.lng) ? current.lng : SEED.office.lng,
  };
}

class ContactService {
  private ensureSeed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return;
    }

    if (typeof parsed !== "object" || parsed === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return;
    }

    const data = parsed as Partial<ContactContentData>;
    const normalized: ContactContentData = {
      details: normalizeDetails(data.details),
      socials: normalizeSocials(data.socials),
      faq: normalizeFaq(data.faq),
      office: normalizeOffice(data.office),
    };

    if (JSON.stringify(normalized) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  }

  private read(): ContactContentData {
    this.ensureSeed();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;

    try {
      const parsed = JSON.parse(raw) as ContactContentData;
      return {
        details: normalizeDetails(parsed.details),
        socials: normalizeSocials(parsed.socials),
        faq: normalizeFaq(parsed.faq),
        office: normalizeOffice(parsed.office),
      };
    } catch {
      return SEED;
    }
  }

  private write(data: ContactContentData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getContent(): Promise<ContactContentData> {
    await sleep(120);
    return this.read();
  }

  async updateOffice(input: OfficeLocationInput): Promise<OfficeLocation> {
    await sleep(120);
    const data = this.read();
    data.office = normalizeOffice(input);
    this.write(data);
    return data.office;
  }

  async createDetail(input: ContactDetailInput): Promise<ContactDetail> {
    await sleep(120);
    const data = this.read();
    const next: ContactDetail = { id: uid("detail"), ...input };
    data.details = [next, ...data.details];
    this.write(data);
    return next;
  }

  async updateDetail(id: string, input: ContactDetailInput): Promise<ContactDetail | null> {
    await sleep(120);
    const data = this.read();
    const index = data.details.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: ContactDetail = { id, ...input };
    data.details[index] = updated;
    this.write(data);
    return updated;
  }

  async removeDetail(id: string): Promise<boolean> {
    await sleep(120);
    const data = this.read();
    const before = data.details.length;
    const next = data.details.filter((item) => item.id !== id);
    data.details = next;
    this.write(data);
    return next.length !== before;
  }

  async createSocial(input: SocialLinkInput): Promise<SocialLink> {
    await sleep(120);
    const data = this.read();
    const next: SocialLink = { id: uid("social"), ...input };
    data.socials = [next, ...data.socials];
    this.write(data);
    return next;
  }

  async updateSocial(id: string, input: SocialLinkInput): Promise<SocialLink | null> {
    await sleep(120);
    const data = this.read();
    const index = data.socials.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: SocialLink = { id, ...input };
    data.socials[index] = updated;
    this.write(data);
    return updated;
  }

  async removeSocial(id: string): Promise<boolean> {
    await sleep(120);
    const data = this.read();
    const before = data.socials.length;
    const next = data.socials.filter((item) => item.id !== id);
    data.socials = next;
    this.write(data);
    return next.length !== before;
  }

  async createFaq(input: FaqItemInput): Promise<FaqItem> {
    await sleep(120);
    const data = this.read();
    const next: FaqItem = { id: uid("faq"), ...input };
    data.faq = [next, ...data.faq];
    this.write(data);
    return next;
  }

  async updateFaq(id: string, input: FaqItemInput): Promise<FaqItem | null> {
    await sleep(120);
    const data = this.read();
    const index = data.faq.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: FaqItem = { id, ...input };
    data.faq[index] = updated;
    this.write(data);
    return updated;
  }

  async removeFaq(id: string): Promise<boolean> {
    await sleep(120);
    const data = this.read();
    const before = data.faq.length;
    const next = data.faq.filter((item) => item.id !== id);
    data.faq = next;
    this.write(data);
    return next.length !== before;
  }
}

export const contactService = new ContactService();
