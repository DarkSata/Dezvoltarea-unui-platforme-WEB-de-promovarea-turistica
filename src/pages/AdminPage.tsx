import React, { useEffect, useMemo, useState } from "react";
import { destinationsService } from "../services/destinationsService";
import type { Destination, DestinationCategory } from "../types/destination";

type FormState = {
    name: string;
    area: string;
    cat: DestinationCategory;
    desc: string;
    tips: string;
    lat: string;
    lng: string;
};

const CATS: DestinationCategory[] = ["Natura", "Vin", "Manastiri", "Istorie", "Orase"];

const EMPTY_FORM: FormState = {
    name: "",
    area: "",
    cat: "Istorie",
    desc: "",
    tips: "",
    lat: "47.0000",
    lng: "28.8000",
};

function validate(v: FormState) {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!v.name.trim()) errs.name = "Name is required";
    else if (v.name.trim().length < 3) errs.name = "Min 3 chars";

    if (!v.area.trim()) errs.area = "Area is required";
    else if (v.area.trim().length < 2) errs.area = "Min 2 chars";

    if (!v.desc.trim()) errs.desc = "Description is required";
    else if (v.desc.trim().length < 10) errs.desc = "Min 10 chars";

    if (!v.tips.trim()) errs.tips = "Tips is required";
    else if (v.tips.trim().length < 6) errs.tips = "Min 6 chars";

    const lat = Number(v.lat);
    if (!Number.isFinite(lat)) errs.lat = "Lat must be a number";
    else if (lat < -90 || lat > 90) errs.lat = "Lat must be in [-90, 90]";

    const lng = Number(v.lng);
    if (!Number.isFinite(lng)) errs.lng = "Lng must be a number";
    else if (lng < -180 || lng > 180) errs.lng = "Lng must be in [-180, 180]";

    return errs;
}

function toPayload(form: FormState): Omit<Destination, "id"> {
    return {
        name: form.name.trim(),
        area: form.area.trim(),
        cat: form.cat,
        desc: form.desc.trim(),
        tips: form.tips.trim(),
        lat: Number(form.lat),
        lng: Number(form.lng),
    };
}

export default function AdminPage() {
    const [items, setItems] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Destination | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const errors = useMemo(() => validate(form), [form]);
    const canSubmit = Object.keys(errors).length === 0;

    async function load() {
        setLoading(true);
        const res = await destinationsService.list();
        if (res.ok) setItems(res.data);
        setLoading(false);
    }

    useEffect(() => {
        let active = true;

        async function initialLoad() {
            const res = await destinationsService.list();
            if (!active) return;
            if (res.ok) setItems(res.data);
            setLoading(false);
        }

        void initialLoad();
        return () => {
            active = false;
        };
    }, []);

    function startCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
    }

    function startEdit(d: Destination) {
        setEditing(d);
        setForm({
            name: d.name,
            area: d.area,
            cat: d.cat,
            desc: d.desc,
            tips: d.tips,
            lat: String(d.lat),
            lng: String(d.lng),
        });
    }

    async function save(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        const payload = toPayload(form);
        if (!editing) {
            await destinationsService.create(payload);
        } else {
            await destinationsService.update(editing.id, payload);
        }

        await load();
        startCreate();
    }

    async function remove(id: string) {
        const ok = window.confirm("Ștergi acest element?");
        if (!ok) return;
        await destinationsService.remove(id);
        await load();
    }

    return (
        <main>
            <section className="page-hero">
                <div className="container">
                    <div className="section-head">
                        <h1>Admin CRUD (Destinations)</h1>
                        <p>Create / Update / Delete + validări + mock storage.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container destinations-layout">
                    <div className="destinations-map-wrap">
                        <div className="card">
                            <div className="card-body">
                                <h3 style={{ marginTop: 0 }}>{editing ? "Edit destination" : "Create destination"}</h3>

                                <form onSubmit={save} style={{ display: "grid", gap: 10 }}>
                                    <label className="muted">
                                        Name
                                        <input
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                            value={form.name}
                                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        />
                                        {errors.name && <div className="muted">{errors.name}</div>}
                                    </label>

                                    <label className="muted">
                                        Area
                                        <input
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                            value={form.area}
                                            onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                                        />
                                        {errors.area && <div className="muted">{errors.area}</div>}
                                    </label>

                                    <label className="muted">
                                        Category
                                        <select
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                            value={form.cat}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, cat: e.target.value as DestinationCategory }))
                                            }
                                        >
                                            {CATS.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="muted">
                                        Description
                                        <textarea
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12, minHeight: 90 }}
                                            value={form.desc}
                                            onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                                        />
                                        {errors.desc && <div className="muted">{errors.desc}</div>}
                                    </label>

                                    <label className="muted">
                                        Tips
                                        <textarea
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12, minHeight: 70 }}
                                            value={form.tips}
                                            onChange={(e) => setForm((p) => ({ ...p, tips: e.target.value }))}
                                        />
                                        {errors.tips && <div className="muted">{errors.tips}</div>}
                                    </label>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        <label className="muted">
                                            Latitude
                                            <input
                                                type="number"
                                                step="0.0001"
                                                style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                                value={form.lat}
                                                onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
                                            />
                                            {errors.lat && <div className="muted">{errors.lat}</div>}
                                        </label>

                                        <label className="muted">
                                            Longitude
                                            <input
                                                type="number"
                                                step="0.0001"
                                                style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                                value={form.lng}
                                                onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
                                            />
                                            {errors.lng && <div className="muted">{errors.lng}</div>}
                                        </label>
                                    </div>

                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <button className="btn primary" type="submit" disabled={!canSubmit}>
                                            {editing ? "Update" : "Create"}
                                        </button>
                                        <button className="btn ghost" type="button" onClick={startCreate}>
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <aside className="destinations-list" aria-label="Lista (Admin)">
                        <div className="destinations-meta">
                            <strong>{loading ? "…" : items.length}</strong>
                            <span className="muted">items</span>
                        </div>

                        {items.map((d) => (
                            <article key={d.id} className="card" style={{ marginBottom: 14 }}>
                                <div className="card-body">
                                    <h3 style={{ marginTop: 0 }}>{d.name}</h3>
                                    <p>{d.desc}</p>
                                    <div className="dest-row">
                                        <span className="pill">{d.cat}</span>
                                        <span className="pill">{d.area}</span>
                                    </div>

                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <button className="btn small" type="button" onClick={() => startEdit(d)}>
                                            Edit
                                        </button>
                                        <button className="btn small ghost" type="button" onClick={() => remove(d.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </aside>
                </div>
            </section>
        </main>
    );
}
