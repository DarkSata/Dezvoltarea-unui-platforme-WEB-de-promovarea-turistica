import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { authService } from "../services/authService";

type LoginErrors = {
  username?: string;
  password?: string;
  form?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = authService.getSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const from = useMemo(() => {
    return (location.state as { from?: string } | null)?.from;
  }, [location.state]);

  if (session) {
    return <Navigate to={session.role === "admin" ? "/admin" : "/destinations"} replace />;
  }

  function validate(): LoginErrors {
    const next: LoginErrors = {};

    if (!username.trim()) {
      next.username = "Introdu username.";
    }

    if (!password.trim()) {
      next.password = "Introdu parola.";
    } else if (password.trim().length < 4) {
      next.password = "Parola trebuie sa aiba minim 4 caractere.";
    }

    return next;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const result = authService.login(username.trim(), password.trim());

    if (!result) {
      setErrors({ form: "Credentiale invalide. Incearca admin/admin123 sau user/user123." });
      return;
    }

    const fallback = result.role === "admin" ? "/admin" : "/destinations";
    const nextPath =
      from && !from.startsWith("/40") && from !== "/login" && from !== "/500"
        ? from
        : fallback;

    navigate(nextPath, { replace: true });
  }

  return (
    <section className="section">
      <div className="container auth-wrap">
        <article className="auth-card">
          <h2>Login</h2>
          <p className="muted">Autentificare simulata cu roluri si sesiune in localStorage.</p>

          <form onSubmit={onSubmit} className="admin-form">
            <Input
              label="Username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setErrors((prev) => ({ ...prev, username: undefined, form: undefined }));
              }}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              label="Parola"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
              }}
              error={errors.password}
              autoComplete="current-password"
            />

            {errors.form ? <p className="form-error">{errors.form}</p> : null}

            <div className="form-actions">
              <Button type="submit">Login</Button>
            </div>
          </form>

          <div className="note">
            <strong>Conturi demo:</strong>
            <p className="muted">admin / admin123 (rol admin), user / user123 (rol user)</p>
          </div>
        </article>
      </div>
    </section>
  );
}


