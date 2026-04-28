import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent } from "react";
import Button from "../Button";
import { Select } from "../Select";
import Empty from "../Empty";
import ErrorState from "../Error";
import Loading from "../Loading";
import ModalConfirm from "../ModalConfirm";
import {
  galleryService,
  type GalleryBlock,
  type GalleryBlockInput,
  type GallerySortBy,
  type GalleryTheme,
} from "../../services/galleryService";

type GalleryFormErrors = Partial<Record<keyof GalleryBlockInput, string>>;

const THEMES: GalleryTheme[] = ["galerie-sunset", "galerie-vin", "galerie-nistru"];

const THEME_LABEL: Record<GalleryTheme, string> = {
  "galerie-sunset": "Sunset",
  "galerie-vin": "Vin",
  "galerie-nistru": "Nistru",
};

const EMPTY_FORM: GalleryBlockInput = {
  title: "",
  subtitle: "",
  theme: "galerie-sunset",
};

function validate(input: GalleryBlockInput): GalleryFormErrors {
  const errors: GalleryFormErrors = {};

  if (!input.title.trim()) errors.title = "Titlul este obligatoriu.";
  if (!input.subtitle.trim()) errors.subtitle = "Subtitlul este obligatoriu.";

  return errors;
}

export function GalleryAdminModule() {
  const [items, setItems] = useState<GalleryBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<GalleryBlockInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<GalleryFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<GallerySortBy>("title-asc");

  const countLabel = useMemo(() => `${items.length} inregistrari`, [items.length]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await galleryService.query({
        search,
        sortBy,
        page: 1,
        pageSize: 300,
      });
      setItems(result.items);
    } catch {
      setError("Nu am putut incarca galeria.");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 220);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refresh]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModalOpen(false);
        setForm(EMPTY_FORM);
        setFormErrors({});
        setSubmitError(null);
        setEditingId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  function onFieldChange<K extends keyof GalleryBlockInput>(key: K, value: GalleryBlockInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  }

  function startEdit(item: GalleryBlock) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle,
      theme: item.theme,
    });
    setFormErrors({});
    setSubmitError(null);
    setModalOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const payload: GalleryBlockInput = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      theme: form.theme,
    };

    const errors = validate(payload);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        const updated = await galleryService.update(editingId, payload);
        if (!updated) {
          setSubmitError("Elementul din galerie nu mai exista.");
          return;
        }
      } else {
        await galleryService.create(payload);
      }

      resetForm();
      setModalOpen(false);
      await refresh();
    } catch {
      setSubmitError("Operatia a esuat. Incearca din nou.");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await galleryService.remove(deleteId);
      setDeleteId(null);
      if (editingId === deleteId) {
        resetForm();
        setModalOpen(false);
      }
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut sterge elementul din galerie.");
    }
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-list-head">
          <div className="admin-list-head-left">
            <h3>Galerie</h3>
            <span className="muted">{countLabel}</span>
          </div>
          <button
            type="button"
            className="btn primary"
            style={{ padding: "8px 14px", fontSize: ".85rem", borderRadius: "10px" }}
            onClick={openCreate}
          >
            <i className="fa-solid fa-plus" aria-hidden="true"></i> Adauga nou
          </button>
        </div>

        <div className="destinations-toolbar admin-toolbar">
          <label className="search" aria-label="Cauta in galerie">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cauta dupa titlu sau subtitlu"
            />
          </label>

          <div className="form-field admin-sort">
            <span className="form-label">Sortare</span>
            <Select
              value={sortBy}
              onChange={(v) => setSortBy(v as GallerySortBy)}
              options={[
                { value: "title-asc",  label: "Titlu A-Z" },
                { value: "title-desc", label: "Titlu Z-A" },
              ]}
            />
          </div>
        </div>

        {loading ? <Loading text="Se incarca galeria..." /> : null}
        {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
        {!loading && !error && items.length === 0 ? (
          <Empty title="Galeria este goala" description="Adauga primul item din galerie." />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <div className="admin-list-scroll" aria-label="Lista galerie">
            <div className="grid destinations-cards">
              {items.map((item) => (
                <article key={item.id} className="card admin-item-card">
                  <div className="card-body">
                    <figure className={`gallery-item ${item.theme} admin-gallery-preview`}>
                      <figcaption>
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </figcaption>
                    </figure>
                    <div className="admin-row-actions">
                      <Button type="button" variant="small" onClick={() => startEdit(item)}>
                        Editare
                      </Button>
                      <Button
                        type="button"
                        variant="small"
                        className="danger"
                        onClick={() => setDeleteId(item.id)}
                      >
                        Stergere
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {modalOpen
        ? createPortal(
            <div
              className="admin-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-modal-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <div className="admin-modal-dialog">
                <div className="admin-modal-head">
                  <div className="admin-modal-head-text">
                    <h3 id="gallery-modal-title" className="admin-modal-title">
                      {editingId ? `Editare: ${form.title || "galerie"}` : "Adaugare galerie"}
                    </h3>
                    <span className={`admin-fp-badge${editingId ? " edit-mode" : " new-mode"}`}>
                      {editingId ? "Editare" : "Nou"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="admin-modal-close"
                    aria-label="Inchide"
                    onClick={closeModal}
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                </div>

                <form id="gallery-form" className="admin-modal-form" onSubmit={onSubmit}>
                  <div className="admin-modal-body">
                    <div className="admin-fp-fields">
                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Titlu</span>
                        <input
                          className="form-control"
                          value={form.title}
                          onChange={(event) => onFieldChange("title", event.target.value)}
                        />
                        {formErrors.title ? (
                          <span className="form-error">{formErrors.title}</span>
                        ) : null}
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Subtitlu</span>
                        <input
                          className="form-control"
                          value={form.subtitle}
                          onChange={(event) => onFieldChange("subtitle", event.target.value)}
                        />
                        {formErrors.subtitle ? (
                          <span className="form-error">{formErrors.subtitle}</span>
                        ) : null}
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Tema vizuala</span>
                        <Select
                          value={form.theme}
                          onChange={(v) => onFieldChange("theme", v as GalleryTheme)}
                          options={THEMES.map((t) => ({ value: t, label: THEME_LABEL[t] }))}
                        />
                      </label>

                      <div className="admin-fp-field">
                        <span className="admin-fp-label">Preview</span>
                        <figure className={`gallery-item ${form.theme} admin-gallery-preview`}>
                          <figcaption>
                            <strong>{form.title || "Titlu card"}</strong>
                            <span>{form.subtitle || "Subtitlu card"}</span>
                          </figcaption>
                        </figure>
                      </div>
                    </div>

                    {submitError ? <p className="form-error">{submitError}</p> : null}
                  </div>

                  <div className="admin-modal-foot">
                    <button type="button" className="btn ghost" onClick={closeModal}>
                      Anuleaza
                    </button>
                    <button type="button" className="btn ghost" onClick={resetForm}>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className={`btn${editingId ? " btn-save-edit" : " primary"}`}
                    >
                      Salveaza
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}

      <ModalConfirm
        open={Boolean(deleteId)}
        title="Stergere item galerie"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </>
  );
}
