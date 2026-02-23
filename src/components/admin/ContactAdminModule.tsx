import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "../Button";
import Empty from "../Empty";
import ErrorState from "../Error";
import Input from "../Input";
import Loading from "../Loading";
import ModalConfirm from "../ModalConfirm";
import {
  contactService,
  type ContactDetailInput,
  type FaqItemInput,
  type OfficeLocationInput,
  type SocialLinkInput,
} from "../../services/contactService";
import type { ContactDetail, FaqItem, OfficeLocation, SocialLink } from "../../types/contact";

type ContactAdminView = "details" | "socials" | "faq" | "office";
type LabelSort = "label-asc" | "label-desc";
type FaqSort = "category-asc" | "category-desc" | "question-asc" | "question-desc";

type DeleteTarget =
  | { kind: "detail"; id: string }
  | { kind: "social"; id: string }
  | { kind: "faq"; id: string }
  | null;

type DetailErrors = Partial<Record<keyof ContactDetailInput, string>>;
type SocialErrors = Partial<Record<keyof SocialLinkInput, string>>;
type FaqErrors = Partial<Record<keyof FaqItemInput, string>>;
type OfficeErrors = Partial<Record<keyof OfficeLocationInput, string>>;

const EMPTY_DETAIL: ContactDetailInput = {
  label: "",
  value: "",
  href: "",
  icon: "fa-solid fa-circle-info",
  note: "",
};

const EMPTY_SOCIAL: SocialLinkInput = {
  label: "",
  href: "",
  icon: "fa-brands fa-linkedin-in",
};

const EMPTY_FAQ: FaqItemInput = {
  category: "General",
  question: "",
  answer: "",
};

function validateDetail(input: ContactDetailInput): DetailErrors {
  const errors: DetailErrors = {};
  if (!input.label.trim()) errors.label = "Label obligatoriu.";
  if (!input.value.trim()) errors.value = "Valoare obligatorie.";
  if (!input.href.trim()) errors.href = "Link obligatoriu.";
  if (!input.icon.trim()) errors.icon = "Icon obligatoriu.";
  return errors;
}

function validateSocial(input: SocialLinkInput): SocialErrors {
  const errors: SocialErrors = {};
  if (!input.label.trim()) errors.label = "Label obligatoriu.";
  if (!input.href.trim()) errors.href = "Link obligatoriu.";
  if (!input.icon.trim()) errors.icon = "Icon obligatoriu.";
  return errors;
}

function validateFaq(input: FaqItemInput): FaqErrors {
  const errors: FaqErrors = {};
  if (!input.category.trim()) errors.category = "Categoria este obligatorie.";
  if (!input.question.trim()) errors.question = "Intrebarea este obligatorie.";
  if (!input.answer.trim()) errors.answer = "Raspunsul este obligatoriu.";
  return errors;
}

function validateOffice(input: OfficeLocationInput): OfficeErrors {
  const errors: OfficeErrors = {};
  if (!input.name.trim()) errors.name = "Numele biroului este obligatoriu.";
  if (!input.address.trim()) errors.address = "Adresa este obligatorie.";
  if (!input.city.trim()) errors.city = "Orasul este obligatoriu.";
  if (!input.schedule.trim()) errors.schedule = "Programul este obligatoriu.";
  if (Number.isNaN(input.lat) || input.lat < 45 || input.lat > 49.5) errors.lat = "Latitudine invalida.";
  if (Number.isNaN(input.lng) || input.lng < 26 || input.lng > 30.5) errors.lng = "Longitudine invalida.";
  return errors;
}

export function ContactAdminModule() {
  const detailFormRef = useRef<HTMLFormElement | null>(null);
  const socialFormRef = useRef<HTMLFormElement | null>(null);
  const faqFormRef = useRef<HTMLFormElement | null>(null);
  const officeFormRef = useRef<HTMLFormElement | null>(null);

  const [view, setView] = useState<ContactAdminView>("details");

  const [details, setDetails] = useState<ContactDetail[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [office, setOffice] = useState<OfficeLocation>({
    name: "",
    address: "",
    city: "",
    schedule: "",
    lat: 47.0105,
    lng: 28.8638,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailForm, setDetailForm] = useState<ContactDetailInput>(EMPTY_DETAIL);
  const [socialForm, setSocialForm] = useState<SocialLinkInput>(EMPTY_SOCIAL);
  const [faqForm, setFaqForm] = useState<FaqItemInput>(EMPTY_FAQ);
  const [officeForm, setOfficeForm] = useState<OfficeLocationInput>(office);

  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [socialErrors, setSocialErrors] = useState<SocialErrors>({});
  const [faqErrors, setFaqErrors] = useState<FaqErrors>({});
  const [officeErrors, setOfficeErrors] = useState<OfficeErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const [detailSearch, setDetailSearch] = useState("");
  const [socialSearch, setSocialSearch] = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("Toate");

  const [detailSort, setDetailSort] = useState<LabelSort>("label-asc");
  const [socialSort, setSocialSort] = useState<LabelSort>("label-asc");
  const [faqSort, setFaqSort] = useState<FaqSort>("category-asc");

  const faqCategories = useMemo(
    () => Array.from(new Set(faq.map((item) => item.category))).sort(),
    [faq],
  );

  const filteredDetails = useMemo(() => {
    const term = detailSearch.trim().toLowerCase();
    const rows = details.filter((item) => {
      if (!term) return true;
      return (
        item.label.toLowerCase().includes(term) ||
        item.value.toLowerCase().includes(term) ||
        item.href.toLowerCase().includes(term)
      );
    });
    return [...rows].sort((a, b) =>
      detailSort === "label-desc" ? b.label.localeCompare(a.label) : a.label.localeCompare(b.label),
    );
  }, [detailSearch, detailSort, details]);

  const filteredSocials = useMemo(() => {
    const term = socialSearch.trim().toLowerCase();
    const rows = socials.filter((item) => {
      if (!term) return true;
      return item.label.toLowerCase().includes(term) || item.href.toLowerCase().includes(term);
    });
    return [...rows].sort((a, b) =>
      socialSort === "label-desc" ? b.label.localeCompare(a.label) : a.label.localeCompare(b.label),
    );
  }, [socialSearch, socialSort, socials]);

  const filteredFaq = useMemo(() => {
    const term = faqSearch.trim().toLowerCase();
    let rows = faq.filter((item) => {
      const byCategory = faqCategory === "Toate" || item.category === faqCategory;
      const bySearch =
        !term ||
        item.category.toLowerCase().includes(term) ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term);
      return byCategory && bySearch;
    });

    rows = [...rows].sort((a, b) => {
      if (faqSort === "category-desc") return b.category.localeCompare(a.category);
      if (faqSort === "question-asc") return a.question.localeCompare(b.question);
      if (faqSort === "question-desc") return b.question.localeCompare(a.question);
      return a.category.localeCompare(b.category);
    });

    return rows;
  }, [faq, faqCategory, faqSearch, faqSort]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const content = await contactService.getContent();
      setDetails(content.details);
      setSocials(content.socials);
      setFaq(content.faq);
      setOffice(content.office);
      setOfficeForm(content.office);
    } catch {
      setError("Nu am putut incarca datele de contact.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function resetDetailForm() {
    setDetailForm(EMPTY_DETAIL);
    setDetailErrors({});
    setEditingDetailId(null);
    setSubmitError(null);
  }

  function resetSocialForm() {
    setSocialForm(EMPTY_SOCIAL);
    setSocialErrors({});
    setEditingSocialId(null);
    setSubmitError(null);
  }

  function resetFaqForm() {
    setFaqForm(EMPTY_FAQ);
    setFaqErrors({});
    setEditingFaqId(null);
    setSubmitError(null);
  }

  function startEditDetail(item: ContactDetail) {
    setView("details");
    setEditingDetailId(item.id);
    setDetailForm({
      label: item.label,
      value: item.value,
      href: item.href,
      icon: item.icon,
      note: item.note ?? "",
    });
    setDetailErrors({});
    setSubmitError(null);
    detailFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startEditSocial(item: SocialLink) {
    setView("socials");
    setEditingSocialId(item.id);
    setSocialForm({
      label: item.label,
      href: item.href,
      icon: item.icon,
    });
    setSocialErrors({});
    setSubmitError(null);
    socialFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startEditFaq(item: FaqItem) {
    setView("faq");
    setEditingFaqId(item.id);
    setFaqForm({
      category: item.category,
      question: item.question,
      answer: item.answer,
    });
    setFaqErrors({});
    setSubmitError(null);
    faqFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitDetail(event: FormEvent) {
    event.preventDefault();
    const payload: ContactDetailInput = {
      ...detailForm,
      label: detailForm.label.trim(),
      value: detailForm.value.trim(),
      href: detailForm.href.trim(),
      icon: detailForm.icon.trim(),
      note: detailForm.note?.trim() ? detailForm.note.trim() : undefined,
    };

    const errors = validateDetail(payload);
    setDetailErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingDetailId) {
        const updated = await contactService.updateDetail(editingDetailId, payload);
        if (!updated) {
          setSubmitError("Elementul de contact nu mai exista.");
          return;
        }
      } else {
        await contactService.createDetail(payload);
      }

      resetDetailForm();
      await refresh();
    } catch {
      setSubmitError("Operatia pe date contact a esuat.");
    }
  }

  async function submitSocial(event: FormEvent) {
    event.preventDefault();
    const payload: SocialLinkInput = {
      label: socialForm.label.trim(),
      href: socialForm.href.trim(),
      icon: socialForm.icon.trim(),
    };

    const errors = validateSocial(payload);
    setSocialErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingSocialId) {
        const updated = await contactService.updateSocial(editingSocialId, payload);
        if (!updated) {
          setSubmitError("Canalul social nu mai exista.");
          return;
        }
      } else {
        await contactService.createSocial(payload);
      }

      resetSocialForm();
      await refresh();
    } catch {
      setSubmitError("Operatia pe social links a esuat.");
    }
  }

  async function submitFaq(event: FormEvent) {
    event.preventDefault();
    const payload: FaqItemInput = {
      category: faqForm.category.trim(),
      question: faqForm.question.trim(),
      answer: faqForm.answer.trim(),
    };

    const errors = validateFaq(payload);
    setFaqErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingFaqId) {
        const updated = await contactService.updateFaq(editingFaqId, payload);
        if (!updated) {
          setSubmitError("Intrebarea FAQ nu mai exista.");
          return;
        }
      } else {
        await contactService.createFaq(payload);
      }

      resetFaqForm();
      await refresh();
    } catch {
      setSubmitError("Operatia pe FAQ a esuat.");
    }
  }

  async function submitOffice(event: FormEvent) {
    event.preventDefault();

    const payload: OfficeLocationInput = {
      name: officeForm.name.trim(),
      address: officeForm.address.trim(),
      city: officeForm.city.trim(),
      schedule: officeForm.schedule.trim(),
      lat: Number(officeForm.lat),
      lng: Number(officeForm.lng),
    };

    const errors = validateOffice(payload);
    setOfficeErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await contactService.updateOffice(payload);
      setSubmitError(null);
      await refresh();
    } catch {
      setSubmitError("Actualizarea biroului a esuat.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.kind === "detail") {
        await contactService.removeDetail(deleteTarget.id);
        if (editingDetailId === deleteTarget.id) {
          resetDetailForm();
        }
      }

      if (deleteTarget.kind === "social") {
        await contactService.removeSocial(deleteTarget.id);
        if (editingSocialId === deleteTarget.id) {
          resetSocialForm();
        }
      }

      if (deleteTarget.kind === "faq") {
        await contactService.removeFaq(deleteTarget.id);
        if (editingFaqId === deleteTarget.id) {
          resetFaqForm();
        }
      }

      setDeleteTarget(null);
      await refresh();
    } catch {
      setDeleteTarget(null);
      setError("Nu am putut sterge elementul selectat.");
    }
  }

  return (
    <>
      <div className="admin-switch admin-sub-switch" role="tablist" aria-label="Contact admin sectiuni">
        <button type="button" className={`admin-switch-btn ${view === "details" ? "active" : ""}`} onClick={() => setView("details")}>Date contact</button>
        <button type="button" className={`admin-switch-btn ${view === "socials" ? "active" : ""}`} onClick={() => setView("socials")}>Social</button>
        <button type="button" className={`admin-switch-btn ${view === "faq" ? "active" : ""}`} onClick={() => setView("faq")}>FAQ</button>
        <button type="button" className={`admin-switch-btn ${view === "office" ? "active" : ""}`} onClick={() => setView("office")}>Office</button>
      </div>

      {loading ? <Loading text="Se incarca datele Contact..." /> : null}
      {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}

      {!loading && !error && view === "details" ? (
        <div className="admin-module-grid">
          <form ref={detailFormRef} className="admin-form admin-panel" onSubmit={submitDetail}>
            <div className="admin-panel-head"><h3>{editingDetailId ? "Editare date contact" : "Adaugare date contact"}</h3></div>
            <div className="form-grid">
              <Input label="Label" value={detailForm.label} onChange={(event) => setDetailForm((v) => ({ ...v, label: event.target.value }))} error={detailErrors.label} />
              <Input label="Valoare" value={detailForm.value} onChange={(event) => setDetailForm((v) => ({ ...v, value: event.target.value }))} error={detailErrors.value} />
              <Input label="Href" value={detailForm.href} onChange={(event) => setDetailForm((v) => ({ ...v, href: event.target.value }))} error={detailErrors.href} />
              <Input label="Icon" value={detailForm.icon} onChange={(event) => setDetailForm((v) => ({ ...v, icon: event.target.value }))} error={detailErrors.icon} />
              <Input label="Nota (optional)" value={detailForm.note ?? ""} onChange={(event) => setDetailForm((v) => ({ ...v, note: event.target.value }))} error={detailErrors.note} />
            </div>
            {submitError ? <p className="form-error">{submitError}</p> : null}
            <div className="form-actions">
              <Button type="submit">{editingDetailId ? "Salveaza modificarile" : "Adauga"}</Button>
              <Button type="button" variant="ghost" onClick={resetDetailForm}>Reset</Button>
            </div>
          </form>

          <div className="admin-panel">
            <div className="admin-list-head"><h3>Date contact</h3><span className="muted">{filteredDetails.length} inregistrari</span></div>
            <div className="destinations-toolbar admin-toolbar">
              <label className="search"><i className="fa-solid fa-magnifying-glass"></i><input value={detailSearch} onChange={(event) => setDetailSearch(event.target.value)} placeholder="Cauta..." /></label>
              <label className="form-field admin-sort"><span className="form-label">Sortare</span><select className="form-control" value={detailSort} onChange={(event) => setDetailSort(event.target.value as LabelSort)}><option value="label-asc">Label A-Z</option><option value="label-desc">Label Z-A</option></select></label>
            </div>
            {filteredDetails.length === 0 ? <Empty title="Nu sunt elemente" description="Adauga primul element de contact." /> : null}
            {filteredDetails.length > 0 ? (
              <div className="admin-list-scroll">
                <div className="grid destinations-cards">
                  {filteredDetails.map((item) => (
                    <article className="card admin-item-card" key={item.id}>
                      <div className="card-body">
                        <h3>{item.label}</h3>
                        <p>{item.value}</p>
                        <p className="muted">{item.href}</p>
                        <div className="admin-row-actions">
                          <Button type="button" variant="small" onClick={() => startEditDetail(item)}>Editare</Button>
                          <Button type="button" variant="small" className="danger" onClick={() => setDeleteTarget({ kind: "detail", id: item.id })}>Stergere</Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {!loading && !error && view === "socials" ? (
        <div className="admin-module-grid">
          <form ref={socialFormRef} className="admin-form admin-panel" onSubmit={submitSocial}>
            <div className="admin-panel-head"><h3>{editingSocialId ? "Editare social link" : "Adaugare social link"}</h3></div>
            <div className="form-grid">
              <Input label="Label" value={socialForm.label} onChange={(event) => setSocialForm((v) => ({ ...v, label: event.target.value }))} error={socialErrors.label} />
              <Input label="Href" value={socialForm.href} onChange={(event) => setSocialForm((v) => ({ ...v, href: event.target.value }))} error={socialErrors.href} />
              <Input label="Icon" value={socialForm.icon} onChange={(event) => setSocialForm((v) => ({ ...v, icon: event.target.value }))} error={socialErrors.icon} />
            </div>
            {submitError ? <p className="form-error">{submitError}</p> : null}
            <div className="form-actions">
              <Button type="submit">{editingSocialId ? "Salveaza modificarile" : "Adauga"}</Button>
              <Button type="button" variant="ghost" onClick={resetSocialForm}>Reset</Button>
            </div>
          </form>

          <div className="admin-panel">
            <div className="admin-list-head"><h3>Social links</h3><span className="muted">{filteredSocials.length} inregistrari</span></div>
            <div className="destinations-toolbar admin-toolbar">
              <label className="search"><i className="fa-solid fa-magnifying-glass"></i><input value={socialSearch} onChange={(event) => setSocialSearch(event.target.value)} placeholder="Cauta..." /></label>
              <label className="form-field admin-sort"><span className="form-label">Sortare</span><select className="form-control" value={socialSort} onChange={(event) => setSocialSort(event.target.value as LabelSort)}><option value="label-asc">Label A-Z</option><option value="label-desc">Label Z-A</option></select></label>
            </div>
            {filteredSocials.length > 0 ? (
              <div className="admin-list-scroll">
                <div className="grid destinations-cards">
                  {filteredSocials.map((item) => (
                    <article className="card admin-item-card" key={item.id}>
                      <div className="card-body">
                        <h3>{item.label}</h3>
                        <p className="muted">{item.href}</p>
                        <div className="admin-row-actions">
                          <Button type="button" variant="small" onClick={() => startEditSocial(item)}>Editare</Button>
                          <Button type="button" variant="small" className="danger" onClick={() => setDeleteTarget({ kind: "social", id: item.id })}>Stergere</Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : <Empty title="Nu sunt canale" description="Adauga primul social link." />}
          </div>
        </div>
      ) : null}

      {!loading && !error && view === "faq" ? (
        <div className="admin-module-grid">
          <form ref={faqFormRef} className="admin-form admin-panel" onSubmit={submitFaq}>
            <div className="admin-panel-head"><h3>{editingFaqId ? "Editare FAQ" : "Adaugare FAQ"}</h3></div>
            <div className="form-grid">
              <Input label="Categorie" value={faqForm.category} onChange={(event) => setFaqForm((v) => ({ ...v, category: event.target.value }))} error={faqErrors.category} />
              <label className="form-field form-field-full"><span className="form-label">Intrebare</span><textarea className="form-control" rows={2} value={faqForm.question} onChange={(event) => setFaqForm((v) => ({ ...v, question: event.target.value }))}></textarea>{faqErrors.question ? <span className="form-error">{faqErrors.question}</span> : null}</label>
              <label className="form-field form-field-full"><span className="form-label">Raspuns</span><textarea className="form-control" rows={3} value={faqForm.answer} onChange={(event) => setFaqForm((v) => ({ ...v, answer: event.target.value }))}></textarea>{faqErrors.answer ? <span className="form-error">{faqErrors.answer}</span> : null}</label>
            </div>
            {submitError ? <p className="form-error">{submitError}</p> : null}
            <div className="form-actions">
              <Button type="submit">{editingFaqId ? "Salveaza modificarile" : "Adauga"}</Button>
              <Button type="button" variant="ghost" onClick={resetFaqForm}>Reset</Button>
            </div>
          </form>

          <div className="admin-panel">
            <div className="admin-list-head"><h3>FAQ</h3><span className="muted">{filteredFaq.length} inregistrari</span></div>
            <div className="destinations-toolbar admin-toolbar">
              <label className="search"><i className="fa-solid fa-magnifying-glass"></i><input value={faqSearch} onChange={(event) => setFaqSearch(event.target.value)} placeholder="Cauta..." /></label>
              <div className="chips">
                <button type="button" className={`chip ${faqCategory === "Toate" ? "active" : ""}`} onClick={() => setFaqCategory("Toate")}>Toate</button>
                {faqCategories.map((category) => (
                  <button type="button" key={category} className={`chip ${faqCategory === category ? "active" : ""}`} onClick={() => setFaqCategory(category)}>{category}</button>
                ))}
              </div>
              <label className="form-field admin-sort"><span className="form-label">Sortare</span><select className="form-control" value={faqSort} onChange={(event) => setFaqSort(event.target.value as FaqSort)}><option value="category-asc">Categorie A-Z</option><option value="category-desc">Categorie Z-A</option><option value="question-asc">Intrebare A-Z</option><option value="question-desc">Intrebare Z-A</option></select></label>
            </div>
            {filteredFaq.length > 0 ? (
              <div className="admin-list-scroll">
                <div className="grid destinations-cards">
                  {filteredFaq.map((item) => (
                    <article className="card admin-item-card" key={item.id}>
                      <div className="card-body">
                        <h3>{item.category}</h3>
                        <p><strong>{item.question}</strong></p>
                        <p className="muted">{item.answer}</p>
                        <div className="admin-row-actions">
                          <Button type="button" variant="small" onClick={() => startEditFaq(item)}>Editare</Button>
                          <Button type="button" variant="small" className="danger" onClick={() => setDeleteTarget({ kind: "faq", id: item.id })}>Stergere</Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : <Empty title="FAQ gol" description="Adauga prima intrebare." />}
          </div>
        </div>
      ) : null}

      {!loading && !error && view === "office" ? (
        <div className="admin-module-grid">
          <form ref={officeFormRef} className="admin-form admin-panel" onSubmit={submitOffice}>
            <div className="admin-panel-head"><h3>Office</h3></div>
            <div className="form-grid">
              <Input label="Nume" value={officeForm.name} onChange={(event) => setOfficeForm((v) => ({ ...v, name: event.target.value }))} error={officeErrors.name} />
              <Input label="Oras" value={officeForm.city} onChange={(event) => setOfficeForm((v) => ({ ...v, city: event.target.value }))} error={officeErrors.city} />
              <Input label="Program" value={officeForm.schedule} onChange={(event) => setOfficeForm((v) => ({ ...v, schedule: event.target.value }))} error={officeErrors.schedule} />
              <Input label="Adresa" value={officeForm.address} onChange={(event) => setOfficeForm((v) => ({ ...v, address: event.target.value }))} error={officeErrors.address} />
              <Input label="Latitudine" type="number" step="0.000001" value={officeForm.lat} onChange={(event) => setOfficeForm((v) => ({ ...v, lat: Number(event.target.value) }))} error={officeErrors.lat} />
              <Input label="Longitudine" type="number" step="0.000001" value={officeForm.lng} onChange={(event) => setOfficeForm((v) => ({ ...v, lng: Number(event.target.value) }))} error={officeErrors.lng} />
            </div>
            {submitError ? <p className="form-error">{submitError}</p> : null}
            <div className="form-actions">
              <Button type="submit">Salveaza office</Button>
              <Button type="button" variant="ghost" onClick={() => setOfficeForm(office)}>Reset</Button>
            </div>
          </form>

          <div className="admin-panel">
            <div className="card-body">
              <h3>Preview office</h3>
              <p className="muted">{officeForm.name}</p>
              <p>{officeForm.address}</p>
              <p>{officeForm.city}</p>
              <p className="muted">{officeForm.schedule}</p>
              <div className="dest-row bottom">
                <span className="pill">{officeForm.lat.toFixed(6)}</span>
                <span className="pill">{officeForm.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ModalConfirm
        open={Boolean(deleteTarget)}
        title="Stergere element Contact"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </>
  );
}
