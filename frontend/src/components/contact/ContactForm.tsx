import { useMemo, useState, type FormEvent } from "react";
import { isValidEmailStrict } from "../../utils/email";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Introdu un nume valid.";
  }

  if (!isValidEmailStrict(values.email)) {
    errors.email = "Introdu un email valid (ex: nume@domeniu.com).";
  }

  if (values.subject.trim().length < 3) {
    errors.subject = "Subiectul este prea scurt.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Mesajul trebuie sa aiba cel putin 10 caractere.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitted(false);
      return;
    }

    setIsSubmitted(true);
    setValues(INITIAL_VALUES);
  }

  return (
    <article className="card contact-card contact-form-card">
      <div className="card-body">
        <h3>Trimite-ne un mesaj</h3>
        <p className="muted">Spune-ne ce tip de experienta cauti si iti trimitem recomandari potrivite.</p>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field">
              <span className="form-label">Nume</span>
              <input
                className="form-control"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Ex: Ana Popescu"
                autoComplete="name"
              />
              <span className={`form-error ${errors.name ? "" : "form-error-placeholder"}`} aria-live="polite">
                {errors.name ?? " "}
              </span>
            </label>

            <label className="form-field">
              <span className="form-label">Email</span>
              <input
                type="email"
                className="form-control"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Ex: ana@email.com"
                autoComplete="email"
              />
              <span className={`form-error ${errors.email ? "" : "form-error-placeholder"}`} aria-live="polite">
                {errors.email ?? " "}
              </span>
            </label>

            <label className="form-field form-field-full">
              <span className="form-label">Subiect</span>
              <input
                className="form-control"
                value={values.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="Ex: Ruta de 2 zile in Moldova"
              />
              <span className={`form-error ${errors.subject ? "" : "form-error-placeholder"}`} aria-live="polite">
                {errors.subject ?? " "}
              </span>
            </label>

            <label className="form-field form-field-full contact-message-field">
              <span className="form-label">Mesaj</span>
              <textarea
                className="form-control"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Scrie-ne ce tip de experiente te intereseaza."
                rows={5}
              />
              <span className={`form-error ${errors.message ? "" : "form-error-placeholder"}`} aria-live="polite">
                {errors.message ?? " "}
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit">
              Trimite mesajul
            </button>
            {hasErrors ? <span className="form-error">Verifica campurile marcate mai sus.</span> : null}
          </div>
        </form>

        {isSubmitted ? (
          <div className="contact-success" role="status" aria-live="polite">
            <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>Mesajul a fost expediat. Revenim cat mai curand.</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
