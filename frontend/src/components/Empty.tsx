export default function Empty({
  title = "Nu există elemente",
  description = "Nu există nimic de afișat aici.",
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
