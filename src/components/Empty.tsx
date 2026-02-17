export default function Empty({
  title = "No items",
  description = "Nothing to show here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}
