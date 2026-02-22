import ErrorPage from "./ErrorPage";

export default function ServerError500() {
  return (
    <ErrorPage
      code="500"
      title="Drumul este inchis temporar"
      message="A aparut o problema interna in timpul procesarii cererii."
      hint="Echipa tehnica a primit semnalul. Incearca din nou peste cateva momente."
      actions={[
        { to: "/", label: "Inapoi acasa", icon: "fa-solid fa-house" },
        { to: "/contact", label: "Contact suport", variant: "ghost", icon: "fa-solid fa-headset" },
      ]}
    />
  );
}
