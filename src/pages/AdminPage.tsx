import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "../components/Button";
import { GalleryAdminModule } from "../components/admin/GalleryAdminModule";
import { GuideAdminModule } from "../components/admin/GuideAdminModule";
import Empty from "../components/Empty";
import ErrorState from "../components/Error";
import Input from "../components/Input";
import Loading from "../components/Loading";
import ModalConfirm from "../components/ModalConfirm";
import { destinationsService } from "../services/destinationsService";
import { routesService } from "../services/routesService";
import type { Destination, DestinationCategory, DestinationInput } from "../types/destination";
import type { RouteCategory, RouteDurationFilter, TouristRoute, TouristRouteInput } from "../types/routes";

type AdminSection = "destinations" | "routes" | "guide" | "gallery";
type DestinationSortBy = "name-asc" | "name-desc" | "area-asc" | "area-desc";
type RouteSortBy = "title-asc" | "title-desc" | "duration-asc" | "duration-desc";

type RouteForm = {
  title: string;
  subtitle: string;
  details: string;
  category: RouteCategory;
  durationDays: 1 | 2 | 3;
  lat: number;
  lng: number;
  image: string;
};

const DESTINATION_CATEGORIES: DestinationCategory[] = ["Natura", "Vin", "Manastiri", "Istorie", "Orase"];
const ROUTE_CATEGORIES: RouteCategory[] = ["Drumetie", "Ciclism", "Vinarii", "Natura", "Auto", "Autobuz"];

const EMPTY_DESTINATION_FORM: DestinationInput = {
  name: "",
  area: "",
  cat: "Natura",
  lat: 47.0105,
  lng: 28.8638,
  description: "",
  tips: "",
  image: "",
};

const EMPTY_ROUTE_FORM: RouteForm = {
  title: "",
  subtitle: "",
  details: "",
  category: "Drumetie",
  durationDays: 1,
  lat: 47.0105,
  lng: 28.8638,
  image: "",
};

type DestinationFormErrors = Partial<Record<keyof DestinationInput, string>>;
type RouteFormErrors = Partial<Record<keyof RouteForm, string>>;

function validateDestination(input: DestinationInput): DestinationFormErrors {
  const errors: DestinationFormErrors = {};

  if (!input.name.trim()) errors.name = "Numele este obligatoriu.";
  if (!input.area.trim()) errors.area = "Zona este obligatorie.";
  if (!input.description.trim()) errors.description = "Descrierea este obligatorie.";
  if (!input.tips.trim()) errors.tips = "Tips este obligatoriu.";

  if (Number.isNaN(input.lat) || input.lat < 45 || input.lat > 49.5) {
    errors.lat = "Latitudine invalida (45 - 49.5).";
  }

  if (Number.isNaN(input.lng) || input.lng < 26 || input.lng > 30.5) {
    errors.lng = "Longitudine invalida (26 - 30.5).";
  }

  return errors;
}

function validateRoute(input: RouteForm): RouteFormErrors {
  const errors: RouteFormErrors = {};

  if (!input.title.trim()) errors.title = "Titlul rutei este obligatoriu.";
  if (!input.subtitle.trim()) errors.subtitle = "Subtitlul este obligatoriu.";
  if (!input.details.trim()) errors.details = "Descrierea rutei este obligatorie.";

  if (Number.isNaN(input.lat) || input.lat < 45 || input.lat > 49.5) {
    errors.lat = "Latitudine invalida (45 - 49.5).";
  }

  if (Number.isNaN(input.lng) || input.lng < 26 || input.lng > 30.5) {
    errors.lng = "Longitudine invalida (26 - 30.5).";
  }

  return errors;
}

function categoryIcon(category: RouteCategory): string {
  switch (category) {
    case "Drumetie":
      return "fa-solid fa-person-hiking";
    case "Ciclism":
      return "fa-solid fa-bicycle";
    case "Vinarii":
      return "fa-solid fa-wine-glass";
    case "Natura":
      return "fa-solid fa-leaf";
    case "Auto":
      return "fa-solid fa-car";
    case "Autobuz":
      return "fa-solid fa-bus";
    default:
      return "fa-solid fa-route";
  }
}

function buildRouteInput(form: RouteForm, existing?: TouristRoute): TouristRouteInput {
  const lat = Math.min(49.5, Math.max(45, form.lat));
  const lng = Math.min(30.5, Math.max(26, form.lng));

  const line =
    existing?.line?.length && existing.line.length > 1
      ? existing.line.map<[number, number]>((point, index) =>
          index === 0 ? [lat, lng] : [point[0], point[1]],
        )
      : ([
          [lat, lng],
          [Math.min(49.5, lat + 0.08), Math.min(30.5, lng + 0.06)],
          [Math.min(49.5, lat + 0.14), Math.min(30.5, lng + 0.12)],
        ] as [number, number][]);

  const distance = Math.max(
    8,
    Math.round(
      Math.abs(line[line.length - 1][0] - line[0][0]) * 111 +
        Math.abs(line[line.length - 1][1] - line[0][1]) * 78,
    ),
  );

  const topPills = [
    { icon: "fa-solid fa-route", label: `${distance} km` },
    { icon: categoryIcon(form.category), label: form.category.toLowerCase() },
    { icon: "fa-solid fa-clock", label: form.durationDays === 1 ? "1 zi" : `${form.durationDays} zile` },
    { icon: "fa-solid fa-pen-ruler", label: "admin edit" },
  ];

  const bottomPills = [
    { icon: "fa-solid fa-users", label: "grupuri" },
    { icon: "fa-solid fa-compass", label: "explorare" },
    { icon: "fa-solid fa-map-location-dot", label: "traseu" },
  ];

  const firstPointImage = form.image.trim() ? form.image.trim() : "Moldova_Orheiul_Vechi.jpg";

  const points =
    existing?.points?.length && existing.points.length > 1
      ? existing.points.map((point, index) =>
          index === 0
            ? {
                ...point,
                lat,
                lng,
                title: `${form.title.trim()} - Start`,
                desc: form.subtitle.trim(),
                img: firstPointImage,
              }
            : point,
        )
      : [
          {
            lat,
            lng,
            title: `${form.title.trim()} - Start`,
            desc: form.subtitle.trim(),
            img: firstPointImage,
          },
          {
            lat: line[1][0],
            lng: line[1][1],
            title: "Oprire intermediara",
            desc: "Punct de interes pe traseu.",
            img: "Prut_River.jpg",
          },
          {
            lat: line[2][0],
            lng: line[2][1],
            title: `${form.title.trim()} - Final`,
            desc: form.details.trim(),
            img: "Codrii_dolna.jpg",
          },
        ];

  return {
    category: form.category,
    durationDays: form.durationDays,
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    details: form.details.trim(),
    topPills,
    bottomPills,
    line,
    points,
  };
}

export default function AdminPage() {
  const destinationFormRef = useRef<HTMLFormElement | null>(null);
  const routeFormRef = useRef<HTMLFormElement | null>(null);

  const [activeSection, setActiveSection] = useState<AdminSection>("destinations");

  const [destinationItems, setDestinationItems] = useState<Destination[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(true);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [destinationForm, setDestinationForm] = useState<DestinationInput>(EMPTY_DESTINATION_FORM);
  const [destinationFormErrors, setDestinationFormErrors] = useState<DestinationFormErrors>({});
  const [destinationSubmitError, setDestinationSubmitError] = useState<string | null>(null);
  const [destinationEditingId, setDestinationEditingId] = useState<string | null>(null);
  const [destinationDeleteId, setDestinationDeleteId] = useState<string | null>(null);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationCategory, setDestinationCategory] = useState<"Toate" | DestinationCategory>("Toate");
  const [destinationSortBy, setDestinationSortBy] = useState<DestinationSortBy>("name-asc");

  const [routeItems, setRouteItems] = useState<TouristRoute[]>([]);
  const [routeLoading, setRouteLoading] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState<RouteForm>(EMPTY_ROUTE_FORM);
  const [routeFormErrors, setRouteFormErrors] = useState<RouteFormErrors>({});
  const [routeSubmitError, setRouteSubmitError] = useState<string | null>(null);
  const [routeEditingId, setRouteEditingId] = useState<string | null>(null);
  const [routeDeleteId, setRouteDeleteId] = useState<string | null>(null);
  const [routeSearch, setRouteSearch] = useState("");
  const [routeCategory, setRouteCategory] = useState<"Toate" | RouteCategory>("Toate");
  const [routeDuration, setRouteDuration] = useState<RouteDurationFilter>("toate");
  const [routeSortBy, setRouteSortBy] = useState<RouteSortBy>("title-asc");

  const destinationCountLabel = useMemo(
    () => `${destinationItems.length} inregistrari`,
    [destinationItems.length],
  );
  const routeCountLabel = useMemo(() => `${routeItems.length} inregistrari`, [routeItems.length]);

  const refreshDestinations = useCallback(async () => {
    setDestinationLoading(true);
    setDestinationError(null);

    try {
      const result = await destinationsService.query({
        search: destinationSearch,
        category: destinationCategory,
        sortBy: destinationSortBy,
        page: 1,
        pageSize: 300,
      });
      setDestinationItems(result.items);
    } catch {
      setDestinationError("Nu am putut incarca lista de destinatii.");
    } finally {
      setDestinationLoading(false);
    }
  }, [destinationCategory, destinationSearch, destinationSortBy]);

  const refreshRoutes = useCallback(async () => {
    setRouteLoading(true);
    setRouteError(null);

    try {
      const result = await routesService.query({
        search: routeSearch,
        category: routeCategory,
        duration: routeDuration,
        sortBy: routeSortBy,
        page: 1,
        pageSize: 300,
      });
      setRouteItems(result.items);
    } catch {
      setRouteError("Nu am putut incarca lista de rute.");
    } finally {
      setRouteLoading(false);
    }
  }, [routeCategory, routeDuration, routeSearch, routeSortBy]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshDestinations();
    }, 220);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refreshDestinations]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshRoutes();
    }, 220);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refreshRoutes]);

  function resetDestinationForm() {
    setDestinationForm(EMPTY_DESTINATION_FORM);
    setDestinationFormErrors({});
    setDestinationSubmitError(null);
    setDestinationEditingId(null);
  }

  function resetRouteForm() {
    setRouteForm(EMPTY_ROUTE_FORM);
    setRouteFormErrors({});
    setRouteSubmitError(null);
    setRouteEditingId(null);
  }

  function onDestinationFieldChange<K extends keyof DestinationInput>(
    key: K,
    value: DestinationInput[K],
  ) {
    setDestinationForm((prev) => ({ ...prev, [key]: value }));
    setDestinationFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setDestinationSubmitError(null);
  }

  function onRouteFieldChange<K extends keyof RouteForm>(key: K, value: RouteForm[K]) {
    setRouteForm((prev) => ({ ...prev, [key]: value }));
    setRouteFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setRouteSubmitError(null);
  }

  function startDestinationEdit(item: Destination) {
    setActiveSection("destinations");
    setDestinationEditingId(item.id);
    setDestinationForm({
      name: item.name,
      area: item.area,
      cat: item.cat,
      lat: item.lat,
      lng: item.lng,
      description: item.description,
      tips: item.tips,
      image: item.image ?? "",
    });
    setDestinationFormErrors({});
    setDestinationSubmitError(null);
    destinationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startRouteEdit(item: TouristRoute) {
    setActiveSection("routes");
    setRouteEditingId(item.id);
    setRouteForm({
      title: item.title,
      subtitle: item.subtitle,
      details: item.details,
      category: item.category,
      durationDays: item.durationDays,
      lat: item.line[0]?.[0] ?? item.points[0]?.lat ?? 47.0105,
      lng: item.line[0]?.[1] ?? item.points[0]?.lng ?? 28.8638,
      image: item.points[0]?.img ?? "",
    });
    setRouteFormErrors({});
    setRouteSubmitError(null);
    routeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onDestinationSubmit(event: FormEvent) {
    event.preventDefault();

    const payload: DestinationInput = {
      ...destinationForm,
      name: destinationForm.name.trim(),
      area: destinationForm.area.trim(),
      description: destinationForm.description.trim(),
      tips: destinationForm.tips.trim(),
      image: destinationForm.image?.trim() ? destinationForm.image.trim() : undefined,
    };

    const errors = validateDestination(payload);
    setDestinationFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      if (destinationEditingId) {
        const updated = await destinationsService.update(destinationEditingId, payload);
        if (!updated) {
          setDestinationSubmitError("Destinatia nu mai exista.");
          return;
        }
      } else {
        await destinationsService.create(payload);
      }

      resetDestinationForm();
      await refreshDestinations();
    } catch {
      setDestinationSubmitError("Operatia a esuat. Incearca din nou.");
    }
  }

  async function onRouteSubmit(event: FormEvent) {
    event.preventDefault();

    const payload: RouteForm = {
      ...routeForm,
      title: routeForm.title.trim(),
      subtitle: routeForm.subtitle.trim(),
      details: routeForm.details.trim(),
      image: routeForm.image.trim(),
    };

    const errors = validateRoute(payload);
    setRouteFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (routeEditingId) {
        const existing = routeItems.find((item) => item.id === routeEditingId);
        if (!existing) {
          setRouteSubmitError("Ruta nu mai exista.");
          return;
        }

        const updated = await routesService.update(routeEditingId, buildRouteInput(payload, existing));
        if (!updated) {
          setRouteSubmitError("Ruta nu mai exista.");
          return;
        }
      } else {
        await routesService.create(buildRouteInput(payload));
      }

      resetRouteForm();
      await refreshRoutes();
    } catch {
      setRouteSubmitError("Operatia pe ruta a esuat. Incearca din nou.");
    }
  }

  async function confirmDestinationDelete() {
    if (!destinationDeleteId) return;

    try {
      await destinationsService.remove(destinationDeleteId);
      setDestinationDeleteId(null);
      if (destinationEditingId === destinationDeleteId) {
        resetDestinationForm();
      }
      await refreshDestinations();
    } catch {
      setDestinationDeleteId(null);
      setDestinationError("Nu am putut sterge destinatia.");
    }
  }

  async function confirmRouteDelete() {
    if (!routeDeleteId) return;

    try {
      await routesService.remove(routeDeleteId);
      setRouteDeleteId(null);
      if (routeEditingId === routeDeleteId) {
        resetRouteForm();
      }
      await refreshRoutes();
    } catch {
      setRouteDeleteId(null);
      setRouteError("Nu am putut sterge ruta.");
    }
  }

  return (
    <section className="section">
      <div className="container admin-shell">
        <div className="section-head admin-hero-head">
          <h2>Panou Admin</h2>
          <p>
            Administrare completa pentru <strong>Destinatii</strong>, <strong>Rute</strong>, <strong>Ghid</strong> si{" "}
            <strong>Galerie</strong>:
            creare, editare, stergere, cautare si sortare.
          </p>
        </div>

        <div className="admin-switch" role="tablist" aria-label="Sectiuni admin">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "destinations"}
            className={`admin-switch-btn ${activeSection === "destinations" ? "active" : ""}`}
            onClick={() => setActiveSection("destinations")}
          >
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i> Destinatii
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "routes"}
            className={`admin-switch-btn ${activeSection === "routes" ? "active" : ""}`}
            onClick={() => setActiveSection("routes")}
          >
            <i className="fa-solid fa-route" aria-hidden="true"></i> Rute
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "guide"}
            className={`admin-switch-btn ${activeSection === "guide" ? "active" : ""}`}
            onClick={() => setActiveSection("guide")}
          >
            <i className="fa-solid fa-list-check" aria-hidden="true"></i> Ghid
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "gallery"}
            className={`admin-switch-btn ${activeSection === "gallery" ? "active" : ""}`}
            onClick={() => setActiveSection("gallery")}
          >
            <i className="fa-solid fa-images" aria-hidden="true"></i> Galerie
          </button>
        </div>

        {activeSection === "destinations" ? (
          <div className="admin-module-grid">
            <form ref={destinationFormRef} className="admin-form admin-panel" onSubmit={onDestinationSubmit}>
              <div className="admin-panel-head">
                <h3>{destinationEditingId ? "Editare destinatie" : "Adaugare destinatie"}</h3>
                <span className="pill">{destinationEditingId ? "Mod editare" : "Noua"}</span>
              </div>

              <div className="form-grid">
                <Input
                  label="Nume"
                  value={destinationForm.name}
                  onChange={(event) => onDestinationFieldChange("name", event.target.value)}
                  error={destinationFormErrors.name}
                />

                <Input
                  label="Zona"
                  value={destinationForm.area}
                  onChange={(event) => onDestinationFieldChange("area", event.target.value)}
                  error={destinationFormErrors.area}
                />

                <label className="form-field">
                  <span className="form-label">Categorie</span>
                  <select
                    className="form-control"
                    value={destinationForm.cat}
                    onChange={(event) =>
                      onDestinationFieldChange("cat", event.target.value as DestinationCategory)
                    }
                  >
                    {DESTINATION_CATEGORIES.map((item) => (
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
                  value={destinationForm.lat}
                  onChange={(event) => onDestinationFieldChange("lat", Number(event.target.value))}
                  error={destinationFormErrors.lat}
                />

                <Input
                  label="Longitudine"
                  type="number"
                  step="0.0001"
                  value={destinationForm.lng}
                  onChange={(event) => onDestinationFieldChange("lng", Number(event.target.value))}
                  error={destinationFormErrors.lng}
                />

                <Input
                  label="Imagine URL (optional)"
                  value={destinationForm.image ?? ""}
                  onChange={(event) => onDestinationFieldChange("image", event.target.value)}
                  error={destinationFormErrors.image}
                />

                <label className="form-field form-field-full">
                  <span className="form-label">Descriere</span>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={destinationForm.description}
                    onChange={(event) => onDestinationFieldChange("description", event.target.value)}
                  ></textarea>
                  {destinationFormErrors.description ? (
                    <span className="form-error">{destinationFormErrors.description}</span>
                  ) : null}
                </label>

                <label className="form-field form-field-full">
                  <span className="form-label">Sfaturi</span>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={destinationForm.tips}
                    onChange={(event) => onDestinationFieldChange("tips", event.target.value)}
                  ></textarea>
                  {destinationFormErrors.tips ? (
                    <span className="form-error">{destinationFormErrors.tips}</span>
                  ) : null}
                </label>
              </div>

              {destinationSubmitError ? <p className="form-error">{destinationSubmitError}</p> : null}

              <div className="form-actions">
                <Button type="submit">
                  {destinationEditingId ? "Salveaza modificarile" : "Adauga destinatie"}
                </Button>
                <Button type="button" variant="ghost" onClick={resetDestinationForm}>
                  Reset
                </Button>
              </div>
            </form>

            <div className="admin-panel">
              <div className="admin-list-head">
                <h3>Destinatii</h3>
                <span className="muted">{destinationCountLabel}</span>
              </div>

              <div className="destinations-toolbar admin-toolbar">
                <label className="search" aria-label="Cauta in destinatii">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                  <input
                    value={destinationSearch}
                    onChange={(event) => setDestinationSearch(event.target.value)}
                    placeholder="Cauta dupa nume, zona, descriere"
                  />
                </label>

                <div className="chips">
                  <button
                    type="button"
                    className={`chip ${destinationCategory === "Toate" ? "active" : ""}`}
                    onClick={() => setDestinationCategory("Toate")}
                  >
                    Toate
                  </button>
                  {DESTINATION_CATEGORIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${destinationCategory === item ? "active" : ""}`}
                      onClick={() => setDestinationCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <label className="form-field admin-sort">
                  <span className="form-label">Sortare</span>
                  <select
                    className="form-control"
                    value={destinationSortBy}
                    onChange={(event) => setDestinationSortBy(event.target.value as DestinationSortBy)}
                  >
                    <option value="name-asc">Nume A-Z</option>
                    <option value="name-desc">Nume Z-A</option>
                    <option value="area-asc">Zona A-Z</option>
                    <option value="area-desc">Zona Z-A</option>
                  </select>
                </label>
              </div>

              {destinationLoading ? <Loading text="Se incarca destinatiile..." /> : null}
              {!destinationLoading && destinationError ? (
                <ErrorState title="Eroare" message={destinationError} />
              ) : null}
              {!destinationLoading && !destinationError && destinationItems.length === 0 ? (
                <Empty title="Lista este goala" description="Adauga prima destinatie din formular." />
              ) : null}

              {!destinationLoading && !destinationError && destinationItems.length > 0 ? (
                <div className="admin-list-scroll" aria-label="Lista destinatii">
                  <div className="grid destinations-cards">
                    {destinationItems.map((item) => (
                      <article key={item.id} className="card admin-item-card">
                        <div className="card-body">
                          <h3>{item.name}</h3>
                          <div className="dest-row bottom">
                            <span className="pill">{item.cat}</span>
                            <span className="pill">{item.area}</span>
                          </div>
                          <p>{item.description}</p>
                          <div className="admin-row-actions">
                            <Button
                              type="button"
                              variant="small"
                              onClick={() => startDestinationEdit(item)}
                            >
                              Editare
                            </Button>
                            <Button
                              type="button"
                              variant="small"
                              className="danger"
                              onClick={() => setDestinationDeleteId(item.id)}
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
        ) : null}

        {activeSection === "routes" ? (
          <div className="admin-module-grid">
            <form ref={routeFormRef} className="admin-form admin-panel" onSubmit={onRouteSubmit}>
              <div className="admin-panel-head">
                <h3>{routeEditingId ? "Editare ruta" : "Adaugare ruta"}</h3>
                <span className="pill">{routeEditingId ? "Mod editare" : "Noua"}</span>
              </div>

              <div className="form-grid">
                <Input
                  label="Titlu ruta"
                  value={routeForm.title}
                  onChange={(event) => onRouteFieldChange("title", event.target.value)}
                  error={routeFormErrors.title}
                />

                <Input
                  label="Subtitlu"
                  value={routeForm.subtitle}
                  onChange={(event) => onRouteFieldChange("subtitle", event.target.value)}
                  error={routeFormErrors.subtitle}
                />

                <label className="form-field">
                  <span className="form-label">Categorie</span>
                  <select
                    className="form-control"
                    value={routeForm.category}
                    onChange={(event) => onRouteFieldChange("category", event.target.value as RouteCategory)}
                  >
                    {ROUTE_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-field">
                  <span className="form-label">Durata</span>
                  <select
                    className="form-control"
                    value={routeForm.durationDays}
                    onChange={(event) =>
                      onRouteFieldChange("durationDays", Number(event.target.value) as 1 | 2 | 3)
                    }
                  >
                    <option value={1}>1 zi</option>
                    <option value={2}>2 zile</option>
                    <option value={3}>3 zile</option>
                  </select>
                </label>

                <Input
                  label="Latitudine start"
                  type="number"
                  step="0.0001"
                  value={routeForm.lat}
                  onChange={(event) => onRouteFieldChange("lat", Number(event.target.value))}
                  error={routeFormErrors.lat}
                />

                <Input
                  label="Longitudine start"
                  type="number"
                  step="0.0001"
                  value={routeForm.lng}
                  onChange={(event) => onRouteFieldChange("lng", Number(event.target.value))}
                  error={routeFormErrors.lng}
                />

                <Input
                  label="Imagine punct start (optional)"
                  value={routeForm.image}
                  onChange={(event) => onRouteFieldChange("image", event.target.value)}
                  error={routeFormErrors.image}
                />

                <label className="form-field form-field-full">
                  <span className="form-label">Detalii ruta</span>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={routeForm.details}
                    onChange={(event) => onRouteFieldChange("details", event.target.value)}
                  ></textarea>
                  {routeFormErrors.details ? (
                    <span className="form-error">{routeFormErrors.details}</span>
                  ) : null}
                </label>
              </div>

              {routeSubmitError ? <p className="form-error">{routeSubmitError}</p> : null}

              <div className="form-actions">
                <Button type="submit">{routeEditingId ? "Salveaza modificarile" : "Adauga ruta"}</Button>
                <Button type="button" variant="ghost" onClick={resetRouteForm}>
                  Reset
                </Button>
              </div>
            </form>

            <div className="admin-panel">
              <div className="admin-list-head">
                <h3>Rute</h3>
                <span className="muted">{routeCountLabel}</span>
              </div>

              <div className="destinations-toolbar admin-toolbar">
                <label className="search" aria-label="Cauta in rute">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                  <input
                    value={routeSearch}
                    onChange={(event) => setRouteSearch(event.target.value)}
                    placeholder="Cauta dupa titlu, subtitlu, detalii"
                  />
                </label>

                <div className="chips">
                  <button
                    type="button"
                    className={`chip ${routeCategory === "Toate" ? "active" : ""}`}
                    onClick={() => setRouteCategory("Toate")}
                  >
                    Toate
                  </button>
                  {ROUTE_CATEGORIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${routeCategory === item ? "active" : ""}`}
                      onClick={() => setRouteCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="chips">
                  {(["toate", 1, 2, 3] as const).map((item) => (
                    <button
                      key={`duration-${item}`}
                      type="button"
                      className={`chip ${routeDuration === item ? "active" : ""}`}
                      onClick={() => setRouteDuration(item)}
                    >
                      {item === "toate" ? "Durata: toate" : `${item} zi${item > 1 ? "le" : ""}`}
                    </button>
                  ))}
                </div>

                <label className="form-field admin-sort">
                  <span className="form-label">Sortare</span>
                  <select
                    className="form-control"
                    value={routeSortBy}
                    onChange={(event) => setRouteSortBy(event.target.value as RouteSortBy)}
                  >
                    <option value="title-asc">Titlu A-Z</option>
                    <option value="title-desc">Titlu Z-A</option>
                    <option value="duration-asc">Durata asc</option>
                    <option value="duration-desc">Durata desc</option>
                  </select>
                </label>
              </div>

              {routeLoading ? <Loading text="Se incarca rutele..." /> : null}
              {!routeLoading && routeError ? <ErrorState title="Eroare" message={routeError} /> : null}
              {!routeLoading && !routeError && routeItems.length === 0 ? (
                <Empty title="Lista de rute este goala" description="Adauga prima ruta din formular." />
              ) : null}

              {!routeLoading && !routeError && routeItems.length > 0 ? (
                <div className="admin-list-scroll" aria-label="Lista rute">
                  <div className="grid destinations-cards">
                    {routeItems.map((item) => (
                      <article key={item.id} className="card admin-item-card">
                        <div className="card-body">
                          <h3>{item.title}</h3>
                          <div className="dest-row bottom">
                            <span className="pill">
                              <i className={categoryIcon(item.category)} aria-hidden="true"></i> {item.category}
                            </span>
                            <span className="pill">
                              <i className="fa-solid fa-clock" aria-hidden="true"></i> {item.durationDays} zi
                              {item.durationDays > 1 ? "le" : ""}
                            </span>
                          </div>
                          <p>{item.subtitle}</p>
                          <p className="muted">{item.details}</p>
                          <div className="admin-row-actions">
                            <Button type="button" variant="small" onClick={() => startRouteEdit(item)}>
                              Editare
                            </Button>
                            <Button
                              type="button"
                              variant="small"
                              className="danger"
                              onClick={() => setRouteDeleteId(item.id)}
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
        ) : null}

        {activeSection === "guide" ? <GuideAdminModule /> : null}
        {activeSection === "gallery" ? <GalleryAdminModule /> : null}
      </div>

      <ModalConfirm
        open={Boolean(destinationDeleteId)}
        title="Stergere destinatie"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setDestinationDeleteId(null)}
        onConfirm={() => {
          void confirmDestinationDelete();
        }}
      />

      <ModalConfirm
        open={Boolean(routeDeleteId)}
        title="Stergere ruta"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setRouteDeleteId(null)}
        onConfirm={() => {
          void confirmRouteDelete();
        }}
      />
    </section>
  );
}
