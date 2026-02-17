import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [session, setSession] = useState(() => authService.getSession());

  useEffect(() => {
    const unsubscribe = authService.onChange(() => {
      setSession(authService.getSession());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function closeMenu() {
    setIsMobileOpen(false);
  }

  function logout() {
    authService.logout();
    closeMenu();
    navigate("/");
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Acasa" onClick={closeMenu}>
        <img className="logo" src="/Logo_Images.png" alt="Moldova Travel logo" />
        <span className="brand-text">Moldova Travel</span>
      </Link>

      <button
        id="hamburger"
        className="hamburger"
        type="button"
        aria-label="Open navigation"
        aria-controls="site-nav"
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen((value) => !value)}
      >
        <i className="fa-solid fa-bars" aria-hidden="true"></i>
      </button>

      <nav
        id="site-nav"
        className={`site-nav ${isMobileOpen ? "mobile" : ""}`}
        aria-label="Main navigation"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("a")) closeMenu();
        }}
      >
        <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/">
          Acasa
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/destinations"
        >
          Destinatii
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/routes"
        >
          Rute
        </NavLink>
        {session?.role === "admin" ? (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            to="/admin"
          >
            Admin
          </NavLink>
        ) : null}
        {!session ? (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            to="/login"
          >
            Login
          </NavLink>
        ) : (
          <button className="nav-link nav-button" type="button" onClick={logout}>
            Logout ({session.username})
          </button>
        )}
      </nav>
    </header>
  );
}
