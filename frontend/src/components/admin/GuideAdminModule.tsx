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
  const [items, setItems] = useState<GuideChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<GuideChecklistInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<GuideFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(true);
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
      setModalOpen(false);
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
        setModalOpen(false);
      }
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut sterge elementul de ghid.");
    }
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-list-head">
          <div className="admin-list-head-left">
            <h3>Ghid</h3>
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

      {modalOpen
        ? createPortal(
            <div
              className="admin-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guide-modal-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <div className="admin-modal-dialog">
                <div className="admin-modal-head">
                  <div className="admin-modal-head-text">
                    <h3 id="guide-modal-title" className="admin-modal-title">
                      {editingId ? `Editare: ${form.title || "ghid"}` : "Adaugare ghid"}
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

                <form id="guide-form" className="admin-modal-form" onSubmit={onSubmit}>
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
                        <span className="admin-fp-label">Descriere</span>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={form.description}
                          onChange={(event) => onFieldChange("description", event.target.value)}
                        />
                        {formErrors.description ? (
                          <span className="form-error">{formErrors.description}</span>
                        ) : null}
                      </label>
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
