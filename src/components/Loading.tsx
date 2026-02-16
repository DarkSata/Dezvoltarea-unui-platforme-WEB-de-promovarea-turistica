export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="card">
      <div className="card-body">
        <p className="muted">{text}</p>
      </div>
    </div>
  );
}
