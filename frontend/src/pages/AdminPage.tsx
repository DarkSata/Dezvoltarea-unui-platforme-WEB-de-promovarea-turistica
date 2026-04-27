import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Select } from "../components/Select";
import type { FormEvent } from "react";
import { GalleryAdminModule } from "../components/admin/GalleryAdminModule";
import { GuideAdminModule } from "../components/admin/GuideAdminModule";
import { ContactAdminModule } from "../components/admin/ContactAdminModule";
import { LocationPickerMap } from "../components/admin/LocationPickerMap";
import { UsersAdminModule } from "../components/admin/UsersAdminModule";
import { authService } from "../services/authService";
import Empty from "../components/Empty";
import ErrorState from "../components/Error";
import Loading from "../components/Loading";
import ModalConfirm from "../components/ModalConfirm";
import { destinationsService } from "../services/destinationsService";
import { routesService } from "../services/routesService";
import type { Destination, DestinationCategory, DestinationInput } from "../types/destination";
import type { RouteCategory, RouteDurationFilter, TouristRoute, TouristRouteInput } from "../types/routes";

type AdminSection = "destinations" | "routes" | "guide" | "gallery" | "contact" | "users";
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
  const routeFormRef = useRef<HTMLFormElement | null>(null);

  const isAdmin = authService.getSession()?.role === "admin";

  const [activeSection, setActiveSection] = useState<AdminSection>("destinations");

  const [destinationItems, setDestinationItems] = useState<Destination[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(true);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [destinationForm, setDestinationForm] = useState<DestinationInput>(EMPTY_DESTINATION_FORM);
  const [destinationFormErrors, setDestinationFormErrors] = useState<DestinationFormErrors>({});
  const [destinationSubmitError, setDestinationSubmitError] = useState<string | null>(null);
  const [destinationEditingId, setDestinationEditingId] = useState<string | null>(null);
  const [destinationDeleteId, setDestinationDeleteId] = useState<string | null>(null);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
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

  useEffect(() => {
    if (!destinationModalOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDestinationModalOpen(false);
        setDestinationForm(EMPTY_DESTINATION_FORM);
        setDestinationFormErrors({});
        setDestinationSubmitError(null);
        setDestinationEditingId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [destinationModalOpen]);

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
    setDestinationModalOpen(true);
  }

  function openDestinationCreate() {
    resetDestinationForm();
    setDestinationModalOpen(true);
  }

  function closeDestinationModal() {
    setDestinationModalOpen(false);
    resetDestinationForm();
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
      setDestinationModalOpen(false);
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
        setDestinationModalOpen(false);
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

  const sectionTitle =
    activeSection === "destinations" ? "Destinatii" :
    activeSection === "routes"       ? "Rute"        :
    activeSection === "guide"        ? "Ghid"        :
    activeSection === "gallery"      ? "Galerie"     :
    activeSection === "users"        ? "Utilizatori" : "Contact";

  const sectionCount =
    activeSection === "destinations" ? destinationCountLabel :
    activeSection === "routes" ? routeCountLabel : null;

  return (
    <div className="admin-dashboard">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <i className="fa-solid fa-gear" aria-hidden="true"></i>
          <span>Admin</span>
        </div>
        <nav className="admin-sidebar-nav" role="tablist" aria-label="Sectiuni admin">
          {(
            [
              { id: "destinations", icon: "fa-solid fa-location-dot", label: "Destinatii" },
              { id: "routes",       icon: "fa-solid fa-route",         label: "Rute"       },
              { id: "guide",        icon: "fa-solid fa-list-check",    label: "Ghid"       },
              { id: "gallery",      icon: "fa-solid fa-images",        label: "Galerie"    },
              { id: "contact",      icon: "fa-solid fa-address-book",  label: "Contact"    },
              ...(isAdmin
                ? [{ id: "users", icon: "fa-solid fa-users", label: "Utilizatori" }]
                : []),
            ] as { id: AdminSection; icon: string; label: string }[]
          ).map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeSection === id}
              className={`admin-nav-item${activeSection === id ? " active" : ""}`}
              onClick={() => setActiveSection(id)}
            >
              <i className={icon} aria-hidden="true"></i>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-main">

        {/* Stats bar */}
        <div className="admin-stats-bar">
          <div className="admin-stat-cell">
            <span className="admin-stat-num">{destinationItems.length}</span>
            <span className="admin-stat-lbl">Destinatii</span>
          </div>
          <div className="admin-stat-cell">
            <span className="admin-stat-num">{routeItems.length}</span>
            <span className="admin-stat-lbl">Rute</span>
          </div>
          <div className="admin-stat-cell">
            <span className="admin-stat-num">5</span>
            <span className="admin-stat-lbl">Sectiuni</span>
          </div>
        </div>

        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-topbar-title">{sectionTitle}</span>
            {sectionCount ? <span className="muted">{sectionCount}</span> : null}
          </div>
          {activeSection === "destinations" || activeSection === "routes" ? (
            <button
              type="button"
              className="btn primary"
              style={{ padding: "8px 14px", fontSize: ".85rem", borderRadius: "10px" }}
              onClick={activeSection === "destinations" ? openDestinationCreate : resetRouteForm}
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i> Adauga nou
            </button>
          ) : null}
        </div>

        {/* ── Body ── */}
        <div className="admin-body">

          {/* ======= DESTINATIONS ======= */}
          {activeSection === "destinations" ? (
            <>
              {/* List panel */}
              <div className="admin-lp admin-lp-full">
                <label className="search" aria-label="Cauta in destinatii">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                  <input
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    placeholder="Cauta dupa nume, zona, descriere"
                  />
                </label>

                <div className="chips">
                  <button
                    type="button"
                    className={`chip${destinationCategory === "Toate" ? " active" : ""}`}
                    onClick={() => setDestinationCategory("Toate")}
                  >
                    Toate
                  </button>
                  {DESTINATION_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`chip${destinationCategory === c ? " active" : ""}`}
                      onClick={() => setDestinationCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="admin-lp-sort">
                  <span className="admin-fp-label">Sortare</span>
                  <Select
                    value={destinationSortBy}
                    onChange={(v) => setDestinationSortBy(v as DestinationSortBy)}
                    options={[
                      { value: "name-asc",  label: "Nume A-Z" },
                      { value: "name-desc", label: "Nume Z-A" },
                      { value: "area-asc",  label: "Zona A-Z" },
                      { value: "area-desc", label: "Zona Z-A" },
                    ]}
                    ariaLabel="Sortare destinatii"
                  />
                </div>

                {destinationLoading ? <Loading text="Se incarca destinatiile..." /> : null}
                {!destinationLoading && destinationError ? (
                  <ErrorState title="Eroare" message={destinationError} />
                ) : null}
                {!destinationLoading && !destinationError && destinationItems.length === 0 ? (
                  <Empty title="Lista este goala" description="Adauga prima destinatie din formular." />
                ) : null}

                {!destinationLoading && !destinationError && destinationItems.length > 0 ? (
                  <div className="admin-table-scroll">
                    <table className="admin-table" aria-label="Lista destinatii">
                      <thead>
                        <tr>
                          <th>Nume</th>
                          <th>Zona</th>
                          <th>Categorie</th>
                          <th>Actiuni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {destinationItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="muted">{item.area}</td>
                            <td>
                              <span className={`admin-tag admin-tag-${item.cat.toLowerCase()}`}>
                                {item.cat}
                              </span>
                            </td>
                            <td>
                              <div className="admin-row-btns">
                                <button
                                  type="button"
                                  className="admin-btn-edit"
                                  onClick={() => startDestinationEdit(item)}
                                >
                                  Editare
                                </button>
                                <button
                                  type="button"
                                  className="admin-btn-del"
                                  onClick={() => setDestinationDeleteId(item.id)}
                                >
                                  Stergere
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {/* ======= ROUTES ======= */}
          {activeSection === "routes" ? (
            <>
              {/* Form panel */}
              <form ref={routeFormRef} className="admin-fp" onSubmit={onRouteSubmit}>
                <div className="admin-fp-head">
                  <span className="admin-fp-title">
                    {routeEditingId
                      ? `Editare: ${routeForm.title || "ruta"}`
                      : "Adaugare"}
                  </span>
                  <span className={`admin-fp-badge${routeEditingId ? " edit-mode" : " new-mode"}`}>
                    {routeEditingId ? "Editare" : "Nou"}
                  </span>
                </div>

                <div className="admin-fp-fields">
                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Titlu ruta</span>
                    <input
                      className="form-control"
                      value={routeForm.title}
                      onChange={(e) => onRouteFieldChange("title", e.target.value)}
                    />
                    {routeFormErrors.title ? (
                      <span className="form-error">{routeFormErrors.title}</span>
                    ) : null}
                  </label>

                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Subtitlu</span>
                    <input
                      className="form-control"
                      value={routeForm.subtitle}
                      onChange={(e) => onRouteFieldChange("subtitle", e.target.value)}
                    />
                    {routeFormErrors.subtitle ? (
                      <span className="form-error">{routeFormErrors.subtitle}</span>
                    ) : null}
                  </label>

                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Categorie</span>
                    <Select
                      value={routeForm.category}
                      onChange={(v) => onRouteFieldChange("category", v as RouteCategory)}
                      options={ROUTE_CATEGORIES.map((c) => ({ value: c, label: c }))}
                    />
                  </label>

                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Durata</span>
                    <Select
                      value={String(routeForm.durationDays)}
                      onChange={(v) => onRouteFieldChange("durationDays", Number(v) as 1 | 2 | 3)}
                      options={[
                        { value: "1", label: "1 zi" },
                        { value: "2", label: "2 zile" },
                        { value: "3", label: "3 zile" },
                      ]}
                    />
                  </label>

                  <div className="admin-fp-row2">
                    <label className="admin-fp-field">
                      <span className="admin-fp-label">Latitudine</span>
                      <input
                        className="form-control"
                        type="number"
                        step="0.0001"
                        value={routeForm.lat}
                        onChange={(e) => onRouteFieldChange("lat", Number(e.target.value))}
                      />
                      {routeFormErrors.lat ? (
                        <span className="form-error">{routeFormErrors.lat}</span>
                      ) : null}
                    </label>
                    <label className="admin-fp-field">
                      <span className="admin-fp-label">Longitudine</span>
                      <input
                        className="form-control"
                        type="number"
                        step="0.0001"
                        value={routeForm.lng}
                        onChange={(e) => onRouteFieldChange("lng", Number(e.target.value))}
                      />
                      {routeFormErrors.lng ? (
                        <span className="form-error">{routeFormErrors.lng}</span>
                      ) : null}
                    </label>
                  </div>

                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Imagine punct start (optional)</span>
                    <input
                      className="form-control"
                      value={routeForm.image}
                      onChange={(e) => onRouteFieldChange("image", e.target.value)}
                    />
                  </label>

                  <label className="admin-fp-field">
                    <span className="admin-fp-label">Detalii ruta</span>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={routeForm.details}
                      onChange={(e) => onRouteFieldChange("details", e.target.value)}
                    />
                    {routeFormErrors.details ? (
                      <span className="form-error">{routeFormErrors.details}</span>
                    ) : null}
                  </label>
                </div>

                {routeSubmitError ? <p className="form-error">{routeSubmitError}</p> : null}

                <div className="admin-fp-actions">
                  <button
                    type="submit"
                    className={`btn${routeEditingId ? " btn-save-edit" : " primary"}`}
                  >
                    Salveaza
                  </button>
                  <button type="button" className="btn ghost" onClick={resetRouteForm}>
                    Reset
                  </button>
                  {routeEditingId ? (
                    <button
                      type="button"
                      className="btn ghost admin-fp-cancel"
                      onClick={resetRouteForm}
                    >
                      Anuleaza editarea
                    </button>
                  ) : null}
                </div>
              </form>

              {/* List panel */}
              <div className="admin-lp">
                <label className="search" aria-label="Cauta in rute">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                  <input
                    value={routeSearch}
                    onChange={(e) => setRouteSearch(e.target.value)}
                    placeholder="Cauta dupa titlu, subtitlu, detalii"
                  />
                </label>

                <div className="chips">
                  <button
                    type="button"
                    className={`chip${routeCategory === "Toate" ? " active" : ""}`}
                    onClick={() => setRouteCategory("Toate")}
                  >
                    Toate
                  </button>
                  {ROUTE_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`chip${routeCategory === c ? " active" : ""}`}
                      onClick={() => setRouteCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="chips">
                  {(["toate", 1, 2, 3] as const).map((d) => (
                    <button
                      key={`duration-${d}`}
                      type="button"
                      className={`chip${routeDuration === d ? " active" : ""}`}
                      onClick={() => setRouteDuration(d)}
                    >
                      {d === "toate" ? "Durata: toate" : `${d} zi${d > 1 ? "le" : ""}`}
                    </button>
                  ))}
                </div>

                <div className="admin-lp-sort">
                  <span className="admin-fp-label">Sortare</span>
                  <Select
                    value={routeSortBy}
                    onChange={(v) => setRouteSortBy(v as RouteSortBy)}
                    options={[
                      { value: "title-asc",      label: "Titlu A-Z" },
                      { value: "title-desc",     label: "Titlu Z-A" },
                      { value: "duration-asc",   label: "Durata asc" },
                      { value: "duration-desc",  label: "Durata desc" },
                    ]}
                    ariaLabel="Sortare rute"
                  />
                </div>

                {routeLoading ? <Loading text="Se incarca rutele..." /> : null}
                {!routeLoading && routeError ? (
                  <ErrorState title="Eroare" message={routeError} />
                ) : null}
                {!routeLoading && !routeError && routeItems.length === 0 ? (
                  <Empty title="Lista de rute este goala" description="Adauga prima ruta din formular." />
                ) : null}

                {!routeLoading && !routeError && routeItems.length > 0 ? (
                  <table className="admin-table" aria-label="Lista rute">
                    <thead>
                      <tr>
                        <th>Titlu</th>
                        <th>Categorie</th>
                        <th>Durata</th>
                        <th>Actiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>
                            <span
                              className={`admin-tag admin-tag-${item.category.toLowerCase()}`}
                            >
                              <i
                                className={categoryIcon(item.category)}
                                aria-hidden="true"
                                style={{ fontSize: "10px" }}
                              ></i>
                              {item.category}
                            </span>
                          </td>
                          <td className="muted">
                            {item.durationDays} zi{item.durationDays > 1 ? "le" : ""}
                          </td>
                          <td>
                            <div className="admin-row-btns">
                              <button
                                type="button"
                                className="admin-btn-edit"
                                onClick={() => startRouteEdit(item)}
                              >
                                Editare
                              </button>
                              <button
                                type="button"
                                className="admin-btn-del"
                                onClick={() => setRouteDeleteId(item.id)}
                              >
                                Stergere
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
            </>
          ) : null}

          {/* ======= SUBMODULES ======= */}
          {activeSection === "guide" ? (
            <div className="admin-submodule-wrap"><GuideAdminModule /></div>
          ) : null}
          {activeSection === "gallery" ? (
            <div className="admin-submodule-wrap"><GalleryAdminModule /></div>
          ) : null}
          {activeSection === "contact" ? (
            <div className="admin-submodule-wrap"><ContactAdminModule /></div>
          ) : null}
          {activeSection === "users" && isAdmin ? (
            <div className="admin-submodule-wrap"><UsersAdminModule /></div>
          ) : null}

        </div>{/* /admin-body */}
      </div>{/* /admin-main */}

      {destinationModalOpen
        ? createPortal(
            <div
              className="admin-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="destination-modal-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeDestinationModal();
              }}
            >
              <div className="admin-modal-dialog">
                <div className="admin-modal-head">
                  <div className="admin-modal-head-text">
                    <h3 id="destination-modal-title" className="admin-modal-title">
                      {destinationEditingId
                        ? `Editare: ${destinationForm.name || "destinatie"}`
                        : "Adaugare destinatie"}
                    </h3>
                    <span
                      className={`admin-fp-badge${destinationEditingId ? " edit-mode" : " new-mode"}`}
                    >
                      {destinationEditingId ? "Editare" : "Nou"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="admin-modal-close"
                    aria-label="Inchide"
                    onClick={closeDestinationModal}
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                </div>

                <form
                  id="destination-form"
                  className="admin-modal-form"
                  onSubmit={onDestinationSubmit}
                >
                  <div className="admin-modal-body">
                    <div className="admin-fp-fields">
                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Nume</span>
                        <input
                          className="form-control"
                          value={destinationForm.name}
                          onChange={(e) => onDestinationFieldChange("name", e.target.value)}
                        />
                        {destinationFormErrors.name ? (
                          <span className="form-error">{destinationFormErrors.name}</span>
                        ) : null}
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Zona</span>
                        <input
                          className="form-control"
                          value={destinationForm.area}
                          onChange={(e) => onDestinationFieldChange("area", e.target.value)}
                        />
                        {destinationFormErrors.area ? (
                          <span className="form-error">{destinationFormErrors.area}</span>
                        ) : null}
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Categorie</span>
                        <Select
                          value={destinationForm.cat}
                          onChange={(v) => onDestinationFieldChange("cat", v as DestinationCategory)}
                          options={DESTINATION_CATEGORIES.map((c) => ({ value: c, label: c }))}
                        />
                      </label>

                      <div className="admin-fp-field">
                        <span className="admin-fp-label">Locatie pe harta</span>
                        <LocationPickerMap
                          lat={destinationForm.lat}
                          lng={destinationForm.lng}
                          onChange={(lat, lng) => {
                            setDestinationForm((prev) => ({ ...prev, lat, lng }));
                            setDestinationFormErrors((prev) => ({
                              ...prev,
                              lat: undefined,
                              lng: undefined,
                            }));
                            setDestinationSubmitError(null);
                          }}
                        />
                        {destinationFormErrors.lat || destinationFormErrors.lng ? (
                          <span className="form-error">
                            {destinationFormErrors.lat ?? destinationFormErrors.lng}
                          </span>
                        ) : null}
                      </div>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Imagine URL (optional)</span>
                        <input
                          className="form-control"
                          value={destinationForm.image ?? ""}
                          onChange={(e) => onDestinationFieldChange("image", e.target.value)}
                        />
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Descriere</span>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={destinationForm.description}
                          onChange={(e) => onDestinationFieldChange("description", e.target.value)}
                        />
                        {destinationFormErrors.description ? (
                          <span className="form-error">{destinationFormErrors.description}</span>
                        ) : null}
                      </label>

                      <label className="admin-fp-field">
                        <span className="admin-fp-label">Sfaturi</span>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={destinationForm.tips}
                          onChange={(e) => onDestinationFieldChange("tips", e.target.value)}
                        />
                        {destinationFormErrors.tips ? (
                          <span className="form-error">{destinationFormErrors.tips}</span>
                        ) : null}
                      </label>
                    </div>

                    {destinationSubmitError ? (
                      <p className="form-error">{destinationSubmitError}</p>
                    ) : null}
                  </div>

                  <div className="admin-modal-foot">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={closeDestinationModal}
                    >
                      Anuleaza
                    </button>
                    <button type="button" className="btn ghost" onClick={resetDestinationForm}>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className={`btn${destinationEditingId ? " btn-save-edit" : " primary"}`}
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
        open={Boolean(destinationDeleteId)}
        title="Stergere destinatie"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setDestinationDeleteId(null)}
        onConfirm={() => { void confirmDestinationDelete(); }}
      />
      <ModalConfirm
        open={Boolean(routeDeleteId)}
        title="Stergere ruta"
        message="Actiunea nu poate fi anulata. Confirmi stergerea?"
        onCancel={() => setRouteDeleteId(null)}
        onConfirm={() => { void confirmRouteDelete(); }}
      />
    </div>
  );
}
