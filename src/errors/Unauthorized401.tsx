import ErrorPage from "./ErrorPage";

export default function Unauthorized401() {
  return (
    <ErrorPage
      code="401"
      title="Trebuie bilet de intrare"
      message="Nu exista o sesiune activa pentru aceasta pagina."
      hint="Conecteaza-te mai jos si te trimitem imediat inapoi pe ruta dorita."
      actions={[
        { to: "/login", label: "Mergi la login", icon: "fa-solid fa-user-check" },
        { to: "/", label: "Inapoi acasa", variant: "ghost", icon: "fa-solid fa-house" },
      ]}
    />
  );
}
