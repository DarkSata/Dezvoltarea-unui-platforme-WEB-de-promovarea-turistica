import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { authService } from "../services/authService";

type Tab = "login" | "register";

type LoginErrors   = { username?: string; password?: string; form?: string };
type RegisterErrors = { username?: string; password?: string; confirm?: string; form?: string };

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const session   = authService.getSession();

  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors,   setLoginErrors]   = useState<LoginErrors>({});

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm,  setRegConfirm]  = useState("");
  const [regErrors,   setRegErrors]   = useState<RegisterErrors>({});

  const from = useMemo(() => {
    return (location.state as { from?: string } | null)?.from;
  }, [location.state]);

  if (session) {
    return <Navigate to={session.role === "admin" ? "/admin" : "/destinations"} replace />;
  }

  function validateLogin(): LoginErrors {
    const next: LoginErrors = {};
    if (!loginUsername.trim()) next.username = "Introdu numele de utilizator.";
    if (!loginPassword.trim()) next.password = "Introdu parola.";
    else if (loginPassword.trim().length < 4) next.password = "Parola trebuie să aibă minimum 4 caractere.";
    return next;
  }

  function validateRegister(): RegisterErrors {
    const next: RegisterErrors = {};
    if (!regUsername.trim())  next.username = "Introdu un nume de utilizator.";
    else if (regUsername.trim().length < 3) next.username = "Username-ul trebuie să aibă minimum 3 caractere.";
    if (!regPassword.trim())  next.password = "Introdu o parolă.";
    else if (regPassword.trim().length < 4) next.password = "Parola trebuie să aibă minimum 4 caractere.";
    if (regPassword !== regConfirm) next.confirm = "Parolele nu coincid.";
    return next;
  }

  async function onLoginSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validateLogin();
    if (Object.keys(validation).length > 0) { setLoginErrors(validation); return; }

    const result = await authService.login(loginUsername.trim(), loginPassword.trim());
    if (!result) {
      setLoginErrors({ form: "Credențiale invalide." });
      return;
    }
    const fallback = result.role === "admin" ? "/admin" : "/destinations";
    const nextPath = from && !/^\/(40|50)\d$/.test(from) && from !== "/login" ? from : fallback;
    navigate(nextPath, { replace: true });
  }

  async function onRegisterSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validateRegister();
    if (Object.keys(validation).length > 0) { setRegErrors(validation); return; }

    const { user, error } = await authService.register(regUsername.trim(), regPassword.trim());
    if (!user) {
      setRegErrors({ form: error ?? "Eroare la înregistrare." });
      return;
    }
    navigate("/destinations", { replace: true });
  }

  return (
    <section className="section">
      <div className="container auth-wrap">
        <article className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Autentificare
            </button>
            <button
              type="button"
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Înregistrare
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={onLoginSubmit} className="admin-form">
              <Input
                label="Username"
                value={loginUsername}
                onChange={(e) => { setLoginUsername(e.target.value); setLoginErrors(p => ({ ...p, username: undefined, form: undefined })); }}
                error={loginErrors.username}
                autoComplete="username"
              />
              <Input
                label="Parola"
                type="password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors(p => ({ ...p, password: undefined, form: undefined })); }}
                error={loginErrors.password}
                autoComplete="current-password"
              />
              {loginErrors.form ? <p className="form-error">{loginErrors.form}</p> : null}
              <div className="form-actions">
                <Button type="submit">Intră în cont</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegisterSubmit} className="admin-form">
              <Input
                label="Username"
                value={regUsername}
                onChange={(e) => { setRegUsername(e.target.value); setRegErrors(p => ({ ...p, username: undefined, form: undefined })); }}
                error={regErrors.username}
                autoComplete="username"
              />
              <Input
                label="Parola"
                type="password"
                value={regPassword}
                onChange={(e) => { setRegPassword(e.target.value); setRegErrors(p => ({ ...p, password: undefined, confirm: undefined })); }}
                error={regErrors.password}
                autoComplete="new-password"
              />
              <Input
                label="Confirmă parola"
                type="password"
                value={regConfirm}
                onChange={(e) => { setRegConfirm(e.target.value); setRegErrors(p => ({ ...p, confirm: undefined })); }}
                error={regErrors.confirm}
                autoComplete="new-password"
              />
              {regErrors.form ? <p className="form-error">{regErrors.form}</p> : null}
              <div className="form-actions">
                <Button type="submit">Creează cont</Button>
              </div>
            </form>
          )}
        </article>
      </div>
    </section>
  );
}
