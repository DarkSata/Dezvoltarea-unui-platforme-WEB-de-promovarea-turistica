export default function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
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
