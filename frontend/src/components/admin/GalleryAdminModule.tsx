import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "../Button";
import { Select } from "../Select";
import Empty from "../Empty";
import ErrorState from "../Error";
import Input from "../Input";
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
  const formRef = useRef<HTMLFormElement | null>(null);

  const [items, setItems] = useState<GalleryBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<GalleryBlockInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<GalleryFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
    setEditingId(null);
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
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      }
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut sterge elementul din galerie.");
    }
  }

  return (
    <>
      <div className="admin-module-grid">
        <form ref={formRef} className="admin-form admin-panel" onSubmit={onSubmit}>
          <div className="admin-panel-head">
            <h3>{editingId ? "Editare galerie" : "Adaugare galerie"}</h3>
            <span className="pill">{editingId ? "Mod editare" : "Nou"}</span>
          </div>

          <div className="form-grid">
            <Input
              label="Titlu"
              value={form.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              error={formErrors.title}
            />

            <Input
              label="Subtitlu"
              value={form.subtitle}
              onChange={(event) => onFieldChange("subtitle", event.target.value)}
              error={formErrors.subtitle}
            />

            <label className="form-field">
              <span className="form-label">Tema vizuala</span>
              <Select
                value={form.theme}
                onChange={(v) => onFieldChange("theme", v as GalleryTheme)}
                options={THEMES.map((t) => ({ value: t, label: THEME_LABEL[t] }))}
              />
            </label>

            <div className="form-field">
              <span className="form-label">Preview</span>
              <figure className={`gallery-item ${form.theme} admin-gallery-preview`}>
                <figcaption>
                  <strong>{form.title || "Titlu card"}</strong>
                  <span>{form.subtitle || "Subtitlu card"}</span>
                </figcaption>
              </figure>
            </div>
          </div>

          {submitError ? <p className="form-error">{submitError}</p> : null}

          <div className="form-actions">
            <Button type="submit">{editingId ? "Salveaza modificarile" : "Adauga galerie"}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>

        <div className="admin-panel">
          <div className="admin-list-head">
            <h3>Galerie</h3>
            <span className="muted">{countLabel}</span>
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
      </div>

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
