import { api } from "./apiClient";
import type { ContactDetail, FaqItem, OfficeLocation, SocialLink } from "../types/contact";

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

class ContactService {
  async getContent(): Promise<ContactContentData> {
    return api.get<ContactContentData>("/api/contact/content");
  }

  async updateOffice(input: OfficeLocationInput): Promise<OfficeLocation> {
    return api.put<OfficeLocation>("/api/contact/office", input);
  }

  async createDetail(input: ContactDetailInput): Promise<ContactDetail> {
    return api.post<ContactDetail>("/api/contact/details", input);
  }

  async updateDetail(id: string, input: ContactDetailInput): Promise<ContactDetail | null> {
    try {
      return await api.put<ContactDetail>(`/api/contact/details/${id}`, input);
    } catch {
      return null;
    }
  }

  async removeDetail(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/contact/details/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async createSocial(input: SocialLinkInput): Promise<SocialLink> {
    return api.post<SocialLink>("/api/contact/socials", input);
  }

  async updateSocial(id: string, input: SocialLinkInput): Promise<SocialLink | null> {
    try {
      return await api.put<SocialLink>(`/api/contact/socials/${id}`, input);
    } catch {
      return null;
    }
  }

  async removeSocial(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/contact/socials/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async createFaq(input: FaqItemInput): Promise<FaqItem> {
    return api.post<FaqItem>("/api/contact/faq", input);
  }

  async updateFaq(id: string, input: FaqItemInput): Promise<FaqItem | null> {
    try {
      return await api.put<FaqItem>(`/api/contact/faq/${id}`, input);
    } catch {
      return null;
    }
  }

  async removeFaq(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/contact/faq/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const contactService = new ContactService();
