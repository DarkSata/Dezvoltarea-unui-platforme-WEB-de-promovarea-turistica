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
  guideService,
  type GuideChecklistInput,
  type GuideChecklistItem,
  type GuideSortBy,
} from "../../services/guideService";

type GuideFormErrors = Partial<Record<keyof GuideChecklistInput, string>>;

const EMPTY_FORM: GuideChecklistInput = {
  title: "",
  description: "",
};

function validate(input: GuideChecklistInput): GuideFormErrors {
  const errors: GuideFormErrors = {};

  if (!input.title.trim()) errors.title = "Titlul este obligatoriu.";
  if (!input.description.trim()) errors.description = "Descrierea este obligatorie.";

  return errors;
}

export function GuideAdminModule() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [items, setItems] = useState<GuideChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<GuideChecklistInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<GuideFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<GuideSortBy>("title-asc");

  const countLabel = useMemo(() => `${items.length} inregistrari`, [items.length]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await guideService.query({
        search,
        sortBy,
        page: 1,
        pageSize: 300,
      });
      setItems(result.items);
    } catch {
      setError("Nu am putut incarca lista de ghid.");
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

  function onFieldChange<K extends keyof GuideChecklistInput>(key: K, value: GuideChecklistInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  }

  function startEdit(item: GuideChecklistItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
    });
    setFormErrors({});
    setSubmitError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const payload: GuideChecklistInput = {
      title: form.title.trim(),
      description: form.description.trim(),
    };

    const errors = validate(payload);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        const updated = await guideService.update(editingId, payload);
        if (!updated) {
          setSubmitError("Elementul de ghid nu mai exista.");
          return;
        }
      } else {
        await guideService.create(payload);
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
      await guideService.remove(deleteId);
      setDeleteId(null);
      if (editingId === deleteId) {
        resetForm();
      }
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut sterge elementul de ghid.");
    }
  }

  return (
    <>
      <div className="admin-module-grid">
        <form ref={formRef} className="admin-form admin-panel" onSubmit={onSubmit}>
          <div className="admin-panel-head">
            <h3>{editingId ? "Editare ghid" : "Adaugare ghid"}</h3>
            <span className="pill">{editingId ? "Mod editare" : "Nou"}</span>
          </div>

          <div className="form-grid">
            <Input
              label="Titlu"
              value={form.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              error={formErrors.title}
            />

            <label className="form-field form-field-full">
              <span className="form-label">Descriere</span>
              <textarea
                className="form-control"
                rows={4}
                value={form.description}
                onChange={(event) => onFieldChange("description", event.target.value)}
              ></textarea>
              {formErrors.description ? <span className="form-error">{formErrors.description}</span> : null}
            </label>
          </div>

          {submitError ? <p className="form-error">{submitError}</p> : null}

          <div className="form-actions">
            <Button type="submit">{editingId ? "Salveaza modificarile" : "Adauga ghid"}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>

        <div className="admin-panel">
          <div className="admin-list-head">
            <h3>Ghid</h3>
            <span className="muted">{countLabel}</span>
          </div>

          <div className="destinations-toolbar admin-toolbar">
            <label className="search" aria-label="Cauta in ghid">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cauta dupa titlu sau descriere"
              />
            </label>

            <div className="form-field admin-sort">
              <span className="form-label">Sortare</span>
              <Select
                value={sortBy}
                onChange={(v) => setSortBy(v as GuideSortBy)}
                options={[
                  { value: "title-asc",  label: "Titlu A-Z" },
                  { value: "title-desc", label: "Titlu Z-A" },
                ]}
              />
            </div>
          </div>

          {loading ? <Loading text="Se incarca ghidul..." /> : null}
          {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
          {!loading && !error && items.length === 0 ? (
            <Empty title="Lista ghid este goala" description="Adauga primul punct de ghid." />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <div className="admin-list-scroll" aria-label="Lista ghid">
              <div className="grid destinations-cards">
                {items.map((item) => (
                  <article key={item.id} className="card admin-item-card">
                    <div className="card-body">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
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
        title="Stergere element ghid"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </>
  );
}
