import ErrorPage from "./ErrorPage";

export default function Forbidden403() {
  return (
    <ErrorPage
      code="403"
      title="Acces interzis - zona protejata"
      message="Ai ajuns intr-o zona rezervata ghizilor autorizati. Contul curent nu are permisiunea necesara."
      hint="Daca e o eroare, autentifica-te cu un cont potrivit sau contacteaza administratorul."
      actions={[
        { to: "/login", label: "Autentificare", icon: "fa-solid fa-right-to-bracket" },
        { to: "/", label: "Inapoi acasa", variant: "ghost", icon: "fa-solid fa-house" },
      ]}
    />
  );
}
