import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Button from "../Button";
import { Select } from "../Select";
import Empty from "../Empty";
import ErrorState from "../Error";
import Input from "../Input";
import Loading from "../Loading";
import ModalConfirm from "../ModalConfirm";
import { userAdminService } from "../../services/userAdminService";
import type { AdminUser, UserRole, UserUpdateInput } from "../../types/user";

type EditForm = {
  username: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
};

type EditFormErrors = Partial<Record<keyof EditForm, string>>;

const EMPTY_FORM: EditForm = {
  username: "",
  email: "",
  role: "user",
  password: "",
  confirmPassword: "",
};

function validate(form: EditForm): EditFormErrors {
  const errors: EditFormErrors = {};
  if (!form.username.trim()) errors.username = "Username-ul este obligatoriu.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Email invalid.";
  }
  if (form.password && form.password.length < 4) {
    errors.password = "Parola trebuie sa aiba cel putin 4 caractere.";
  }
  if (form.password && form.password !== form.confirmPassword) {
    errors.confirmPassword = "Parolele nu coincid.";
  }
  return errors;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ro-MD", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function UsersAdminModule() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<EditFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"toate" | UserRole>("toate");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userAdminService.getAll();
      setUsers(result.items);
    } catch {
      setError("Nu am putut incarca lista de utilizatori.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "toate" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
    setEditingId(null);
  }

  function onFieldChange<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setForm({
      username: user.username,
      email: user.email ?? "",
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setSubmitError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (editingId === null) return;

    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: UserUpdateInput = {
      username: form.username.trim(),
      email: form.email.trim() || "",
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    try {
      const updated = await userAdminService.update(editingId, payload);
      if (!updated) {
        setSubmitError("Utilizatorul nu mai exista.");
        return;
      }
      resetForm();
      await refresh();
    } catch {
      setSubmitError("Operatia a esuat. Incearca din nou.");
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    try {
      await userAdminService.remove(deleteId);
      setDeleteId(null);
      if (editingId === deleteId) resetForm();
      await refresh();
    } catch {
      setDeleteId(null);
      setError("Nu am putut sterge utilizatorul.");
    }
  }

  const deleteTarget = users.find((u) => u.id === deleteId);

  return (
    <>
      <div className="admin-module-grid">

        {/* ── Edit form ── */}
        <form ref={formRef} className="admin-form admin-panel" onSubmit={onSubmit}>
          <div className="admin-panel-head">
            <h3>{editingId !== null ? "Editare utilizator" : "Selecteaza un utilizator"}</h3>
            <span className="pill">{editingId !== null ? "Mod editare" : "—"}</span>
          </div>

          {editingId === null ? (
            <p className="muted" style={{ padding: "12px 0" }}>
              Apasa <strong>Editare</strong> pe un utilizator din lista pentru a-l modifica.
            </p>
          ) : (
            <>
              <div className="form-grid">
                <Input
                  label="Username"
                  value={form.username}
                  onChange={(e) => onFieldChange("username", e.target.value)}
                  error={formErrors.username}
                />

                <Input
                  label="Email (optional)"
                  value={form.email}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                  error={formErrors.email}
                />

                <label className="form-field">
                  <span className="form-label">Rol</span>
                  <Select
                    value={form.role}
                    onChange={(v) => onFieldChange("role", v as UserRole)}
                    options={[
                      { value: "user",  label: "User"  },
                      { value: "admin", label: "Admin" },
                    ]}
                  />
                </label>

                <Input
                  label="Parola noua (lasa gol pentru a pastra)"
                  value={form.password}
                  onChange={(e) => onFieldChange("password", e.target.value)}
                  error={formErrors.password}
                />

                <Input
                  label="Confirma parola"
                  value={form.confirmPassword}
                  onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
                  error={formErrors.confirmPassword}
                />
              </div>

              {submitError ? <p className="form-error">{submitError}</p> : null}

              <div className="form-actions">
                <Button type="submit">Salveaza modificarile</Button>
                <Button type="button" variant="ghost" onClick={resetForm}>Anuleaza</Button>
              </div>
            </>
          )}
        </form>

        {/* ── User list ── */}
        <div className="admin-panel">
          <div className="admin-list-head">
            <h3>Utilizatori</h3>
            <span className="muted">{filtered.length} inregistrari</span>
          </div>

          <div className="destinations-toolbar admin-toolbar">
            <label className="search" aria-label="Cauta utilizatori">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cauta dupa username sau email"
              />
            </label>

            <div className="form-field admin-sort">
              <span className="form-label">Rol</span>
              <Select
                value={roleFilter}
                onChange={(v) => setRoleFilter(v as "toate" | UserRole)}
                options={[
                  { value: "toate", label: "Toate" },
                  { value: "user",  label: "User"  },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </div>
          </div>

          {loading ? <Loading text="Se incarca utilizatorii..." /> : null}
          {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
          {!loading && !error && filtered.length === 0 ? (
            <Empty title="Nu exista utilizatori" description="Nu au fost gasiti utilizatori." />
          ) : null}

          {!loading && !error && filtered.length > 0 ? (
            <div className="admin-list-scroll" aria-label="Lista utilizatori">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Inregistrat</th>
                    <th>Actiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className={editingId === user.id ? "editing-row" : ""}>
                      <td>
                        <span className="user-name">{user.username}</span>
                      </td>
                      <td className="muted">{user.email ?? "—"}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                      </td>
                      <td className="muted">{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <Button type="button" variant="small" onClick={() => startEdit(user)}>
                            Editare
                          </Button>
                          <Button
                            type="button"
                            variant="small"
                            className="danger"
                            onClick={() => setDeleteId(user.id)}
                          >
                            Stergere
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>

      <ModalConfirm
        open={Boolean(deleteId)}
        title="Stergere utilizator"
        message={`Stergi utilizatorul "${deleteTarget?.username ?? ""}"? Actiunea nu poate fi anulata.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { void confirmDelete(); }}
      />
    </>
  );
}
