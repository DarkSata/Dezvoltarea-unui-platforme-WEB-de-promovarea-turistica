export default function ErrorState({
  title = "A apărut o eroare",
  message = "Te rugăm să încerci din nou.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h3>{title}</h3>
        <p className="muted">{message}</p>
      </div>
    </div>
  );
}
