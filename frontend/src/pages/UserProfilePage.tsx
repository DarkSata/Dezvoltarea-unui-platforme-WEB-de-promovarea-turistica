import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ErrorState from "../components/Error";
import Input from "../components/Input";
import Loading from "../components/Loading";
import ModalConfirm from "../components/ModalConfirm";
import { authService } from "../services/authService";
import type { UserProfile } from "../types/auth";

type ProfileForm = {
  username: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileErrors = Partial<Record<keyof ProfileForm | "form", string>>;
type PasswordErrors = Partial<Record<keyof PasswordForm | "form", string>>;

const EMPTY_PASSWORD_FORM: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getApiMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ro-MD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({ username: "", email: "" });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>(EMPTY_PASSWORD_FORM);
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await authService.getProfile();
        if (!mounted) return;
        setProfile(data);
        setProfileForm({ username: data.username, email: data.email ?? "" });
      } catch {
        if (mounted) setLoadError("Nu am putut incarca datele contului.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  function validateProfile(): ProfileErrors {
    const errors: ProfileErrors = {};
    if (!profileForm.username.trim()) errors.username = "Username-ul este obligatoriu.";
    else if (profileForm.username.trim().length < 3) errors.username = "Username-ul trebuie sa aiba minimum 3 caractere.";

    if (profileForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email.trim())) {
      errors.email = "Email invalid.";
    }

    return errors;
  }

  function validatePassword(): PasswordErrors {
    const errors: PasswordErrors = {};
    if (!passwordForm.currentPassword.trim()) errors.currentPassword = "Introdu parola curenta.";
    if (!passwordForm.newPassword.trim()) errors.newPassword = "Introdu parola noua.";
    else if (passwordForm.newPassword.trim().length < 4) errors.newPassword = "Parola trebuie sa aiba minimum 4 caractere.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = "Parolele nu coincid.";
    return errors;
  }

  function onProfileFieldChange<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
    setProfileErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    setProfileMessage(null);
  }

  function onPasswordFieldChange<K extends keyof PasswordForm>(key: K, value: PasswordForm[K]) {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
    setPasswordErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    setPasswordMessage(null);
  }

  async function onProfileSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validateProfile();
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const updated = await authService.updateProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim() || "",
      });
      setProfile(updated);
      setProfileForm({ username: updated.username, email: updated.email ?? "" });
      setProfileMessage("Datele contului au fost salvate.");
    } catch (err: unknown) {
      setProfileErrors({ form: getApiMessage(err, "Nu am putut salva datele contului.") });
    }
  }

  async function onPasswordSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validatePassword();
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setPasswordMessage("Parola a fost schimbata.");
    } catch (err: unknown) {
      setPasswordErrors({ form: getApiMessage(err, "Nu am putut schimba parola.") });
    }
  }

  async function confirmDelete() {
    setDeleteError(null);
    try {
      await authService.deleteAccount();
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setDeleteOpen(false);
      setDeleteError(getApiMessage(err, "Nu am putut sterge contul."));
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="hero-kicker">Cont utilizator</p>
          <h1>Contul meu</h1>
          <p className="hero-subtitle">
            Gestioneaza datele personale, parola si accesul la contul Moldova Travel.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? <Loading text="Se incarca profilul..." /> : null}
          {!loading && loadError ? <ErrorState title="Eroare" message={loadError} /> : null}

          {!loading && !loadError && profile ? (
            <div className="admin-module-grid">
              <form className="admin-form admin-panel" onSubmit={onProfileSubmit}>
                <div className="admin-panel-head">
                  <h3>Date cont</h3>
                  <span className={`role-badge role-${profile.role}`}>{profile.role}</span>
                </div>

                <p className="muted">Cont creat: {formatDate(profile.createdAt)}</p>

                <div className="form-grid">
                  <Input
                    label="Username"
                    value={profileForm.username}
                    onChange={(e) => onProfileFieldChange("username", e.target.value)}
                    error={profileErrors.username}
                    autoComplete="username"
                  />
                  <Input
                    label="Email (optional)"
                    value={profileForm.email}
                    onChange={(e) => onProfileFieldChange("email", e.target.value)}
                    error={profileErrors.email}
                    autoComplete="email"
                  />
                </div>

                {profileErrors.form ? <p className="form-error">{profileErrors.form}</p> : null}
                {profileMessage ? <p className="muted">{profileMessage}</p> : null}

                <div className="form-actions">
                  <Button type="submit">Salveaza profilul</Button>
                </div>
              </form>

              <form className="admin-form admin-panel" onSubmit={onPasswordSubmit}>
                <div className="admin-panel-head">
                  <h3>Securitate</h3>
                  <span className="pill">Parola</span>
                </div>

                <div className="form-grid">
                  <Input
                    label="Parola curenta"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => onPasswordFieldChange("currentPassword", e.target.value)}
                    error={passwordErrors.currentPassword}
                    autoComplete="current-password"
                  />
                  <Input
                    label="Parola noua"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => onPasswordFieldChange("newPassword", e.target.value)}
                    error={passwordErrors.newPassword}
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirma parola"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => onPasswordFieldChange("confirmPassword", e.target.value)}
                    error={passwordErrors.confirmPassword}
                    autoComplete="new-password"
                  />
                </div>

                {passwordErrors.form ? <p className="form-error">{passwordErrors.form}</p> : null}
                {passwordMessage ? <p className="muted">{passwordMessage}</p> : null}

                <div className="form-actions">
                  <Button type="submit">Schimba parola</Button>
                </div>
              </form>

              <div className="admin-panel">
                <div className="admin-panel-head">
                  <h3>Stergere cont</h3>
                  <span className="pill">Permanent</span>
                </div>
                <p className="muted">
                  Stergerea contului elimina accesul la profil si necesita o inregistrare noua pentru revenire.
                </p>
                {deleteError ? <p className="form-error">{deleteError}</p> : null}
                <div className="form-actions">
                  <Button type="button" className="danger" onClick={() => setDeleteOpen(true)}>
                    Sterge contul
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ModalConfirm
        open={deleteOpen}
        title="Stergere cont"
        message="Stergi definitiv contul tau? Actiunea nu poate fi anulata."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => { void confirmDelete(); }}
      />
    </>
  );
}
