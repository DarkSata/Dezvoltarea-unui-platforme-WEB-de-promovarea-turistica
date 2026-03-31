import ErrorPage from "./ErrorPage";

export default function ServiceUnavailable503() {
  return (
    <ErrorPage
      code="503"
      title="Serviciul este in pauza de mentenanta"
      message="Platforma lucreaza in culise la o actualizare si nu poate raspunde acum."
      hint="Reimprospateaza pagina peste cateva minute sau revino mai tarziu."
      actions={[
        { to: "/", label: "Inapoi acasa", icon: "fa-solid fa-house" },
        { to: "/routes", label: "Vezi trasee", variant: "ghost", icon: "fa-solid fa-route" },
      ]}
    />
  );
}
