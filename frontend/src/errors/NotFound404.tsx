import ErrorPage from "./ErrorPage";

export default function NotFound404() {
  return (
    <ErrorPage
      code="404"
      title="Te-ai ratacit pe traseu"
      message="Pagina cautata nu exista sau drumul catre ea s-a schimbat."
      hint="Poti reveni pe harta principala sau continua explorarea destinatiilor recomandate."
      actions={[
        { to: "/", label: "Inapoi acasa", icon: "fa-solid fa-house" },
        {
          to: "/destinations",
          label: "Vezi destinatii",
          variant: "ghost",
          icon: "fa-solid fa-compass",
        },
      ]}
    />
  );
}
