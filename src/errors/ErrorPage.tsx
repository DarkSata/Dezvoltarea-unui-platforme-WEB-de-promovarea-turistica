import { Link } from "react-router-dom";

type ErrorAction = {
  to: string;
  label: string;
  variant?: "primary" | "ghost";
  icon?: string;
};

type ErrorPageProps = {
  code: string;
  title: string;
  message: string;
  hint?: string;
  actions: ErrorAction[];
};

export default function ErrorPage({ code, title, message, hint, actions }: ErrorPageProps) {
  return (
    <section className="section error-page-shell">
      <div className="container">
        <article className="error-page" aria-labelledby={`error-title-${code}`}>
          <p className="error-code">{code}</p>
          <h2 id={`error-title-${code}`}>{title}</h2>
          <p className="error-message">{message}</p>
          {hint ? <p className="error-hint">{hint}</p> : null}

          <div className="error-actions">
            {actions.map((action) => (
              <Link
                key={`${code}-${action.to}-${action.label}`}
                className={`btn ${action.variant === "ghost" ? "ghost" : "primary"}`}
                to={action.to}
              >
                {action.icon ? <i className={action.icon} aria-hidden="true"></i> : null}
                {action.label}
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
