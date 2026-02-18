import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Button from "../components/Button";
import Empty from "../components/Empty";
import ErrorState from "../components/Error";
import Input from "../components/Input";
import Loading from "../components/Loading";
import ModalConfirm from "../components/ModalConfirm";
import { destinationsService } from "../services/destinationsService";
import type { Destination, DestinationCategory, DestinationInput } from "../types/destination";

const CATEGORIES: DestinationCategory[] = ["Natura", "Vin", "Manastiri", "Istorie", "Orase"];

const EMPTY_FORM: DestinationInput = {
  name: "",
  area: "",
  cat: "Natura",
  lat: 47.0105,
  lng: 28.8638,
  description: "",
  tips: "",
  image: "",
};

type FormErrors = Partial<Record<keyof DestinationInput, string>>;

function validate(input: DestinationInput): FormErrors {
  const errors: FormErrors = {};

  if (!input.name.trim()) errors.name = "Numele este obligatoriu.";
  if (!input.area.trim()) errors.area = "Zona este obligatorie.";
  if (!input.description.trim()) errors.description = "Descrierea este obligatorie.";
  if (!input.tips.trim()) errors.tips = "Tips este obligatoriu.";
  if (Number.isNaN(input.lat) || input.lat < 45 || input.lat > 49.5) {
    errors.lat = "Latitudine invalidă (45 - 49.5).";
  }
  if (Number.isNaN(input.lng) || input.lng < 26 || input.lng > 30.5) {
    errors.lng = "Longitudine invalidă (26 - 30.5).";
  }

  return errors;
}

export default function AdminPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<DestinationInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"Toate" | DestinationCategory>("Toate");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "area-asc" | "area-desc">("name-asc");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await destinationsService.query({
        search,
        category,
        sortBy,
        page: 1,
        pageSize: 200,
      });
      setItems(result.items);
    } catch {
      setError("Nu am putut încărca lista pentru admin.");
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [refresh]);

  const sortedCountLabel = useMemo(() => `${items.length} înregistrări`, [items.length]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
    setEditingId(null);
  }

  function onFieldChange<K extends keyof DestinationInput>(key: K, value: DestinationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  }

  function startEdit(item: Destination) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      area: item.area,
      cat: item.cat,
      lat: item.lat,
      lng: item.lng,
      description: item.description,
      tips: item.tips,
      image: item.image ?? "",
    });
    setFormErrors({});
    setSubmitError(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const payload: DestinationInput = {
      ...form,
      name: form.name.trim(),
      area: form.area.trim(),
      description: form.description.trim(),
      tips: form.tips.trim(),
      image: form.image?.trim() ? form.image.trim() : undefined,
    };

    const errors = validate(payload);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      if (editingId) {
        const updated = await destinationsService.update(editingId, payload);
        if (!updated) {
          setSubmitError("Elementul nu mai există în listă.");
          return;
        }
      } else {
        await destinationsService.create(payload);
      }

      resetForm();
      await refresh();
    } catch {
      setSubmitError("Operația a eșuat. Încearcă din nou.");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await destinationsService.remove(deleteId);
      setDeleteId(null);
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut șterge destinația.");
    }
  }

  return (
    <section className="section">
      <div className="container admin-layout">
        <div>
          <div className="section-head">
            <h2>Panou Admin</h2>
            <p>CRUD pe destinații, validări de formular, căutare, filtrare și sortare.</p>
          </div>

          <form className="admin-form" onSubmit={onSubmit}>
            <div className="form-grid">
              <Input
                label="Nume"
                value={form.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                error={formErrors.name}
              />

              <Input
                label="Zona"
                value={form.area}
                onChange={(event) => onFieldChange("area", event.target.value)}
                error={formErrors.area}
              />

              <label className="form-field">
                <span className="form-label">Categorie</span>
                <select
                  className="form-control"
                  value={form.cat}
                  onChange={(event) => onFieldChange("cat", event.target.value as DestinationCategory)}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Latitudine"
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={(event) => onFieldChange("lat", Number(event.target.value))}
                error={formErrors.lat}
              />

              <Input
                label="Longitudine"
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={(event) => onFieldChange("lng", Number(event.target.value))}
                error={formErrors.lng}
              />

              <Input
                label="Imagine URL (opțional)"
                value={form.image ?? ""}
                onChange={(event) => onFieldChange("image", event.target.value)}
                error={formErrors.image}
              />

              <label className="form-field form-field-full">
                <span className="form-label">Descriere</span>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(event) => onFieldChange("description", event.target.value)}
                ></textarea>
                {formErrors.description ? (
                  <span className="form-error">{formErrors.description}</span>
                ) : null}
              </label>

              <label className="form-field form-field-full">
                <span className="form-label">Sfaturi</span>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.tips}
                  onChange={(event) => onFieldChange("tips", event.target.value)}
                ></textarea>
                {formErrors.tips ? <span className="form-error">{formErrors.tips}</span> : null}
              </label>
            </div>

            {submitError ? <p className="form-error">{submitError}</p> : null}

            <div className="form-actions">
              <Button type="submit">{editingId ? "Salvează modificările" : "Adaugă destinație"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="admin-list-head">
            <h3>Destinații</h3>
            <span className="muted">{sortedCountLabel}</span>
          </div>

          <div className="destinations-toolbar admin-toolbar">
            <label className="search" aria-label="Caută în lista de admin">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Caută după nume, zonă, descriere"
              />
            </label>

            <div className="chips">
              <button
                type="button"
                className={`chip ${category === "Toate" ? "active" : ""}`}
                onClick={() => setCategory("Toate")}
              >
                Toate
              </button>
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip ${category === item ? "active" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="form-field admin-sort">
              <span className="form-label">Sortare</span>
              <select
                className="form-control"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as "name-asc" | "name-desc" | "area-asc" | "area-desc",
                  )
                }
              >
                <option value="name-asc">Nume A-Z</option>
                <option value="name-desc">Nume Z-A</option>
                <option value="area-asc">Zona A-Z</option>
                <option value="area-desc">Zona Z-A</option>
              </select>
            </label>
          </div>

          {loading ? <Loading text="Se încarcă datele admin..." /> : null}
          {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
          {!loading && !error && items.length === 0 ? (
            <Empty title="Lista este goală" description="Adaugă prima destinație din formular." />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <div className="grid destinations-cards">
              {items.map((item) => (
                <article key={item.id} className="card">
                  <div className="card-body">
                    <h3>{item.name}</h3>
                    <div className="dest-row bottom">
                      <span className="pill">{item.cat}</span>
                      <span className="pill">{item.area}</span>
                    </div>
                    <p>{item.description}</p>
                    <div className="admin-row-actions">
                      <Button variant="small" onClick={() => startEdit(item)}>
                        Editează
                      </Button>
                      <Button variant="small" className="danger" onClick={() => setDeleteId(item.id)}>
                        Șterge
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <ModalConfirm
        open={Boolean(deleteId)}
        title="Ștergere destinație"
        message="Acțiunea nu poate fi anulată. Confirmi ștergerea?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </section>
  );
}


