/* File: src/app/layout/Header.tsx */
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Header() {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [sessionVersion, setSessionVersion] = useState(0);

    const session = useMemo(() => authService.getSession(), [sessionVersion]);

    useEffect(() => {
        const unsubscribe = authService.onChange(() => setSessionVersion((v) => v + 1));

        // cleanup MUST return void (not boolean)
        return () => {
            unsubscribe();
        };
    }, []);

    function toggleMenu() {
        setIsMobileOpen((v) => !v);
    }

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
            <Link className="brand" to="/" aria-label="Acasă" onClick={closeMenu}>
                {/* IMPORTANT: path must match your public folder */}
                <img className="logo" src="/image/Logo_Image.png" alt="Logo Moldova Travel" />
                <span className="brand-text">Moldova Travel</span>
            </Link>

            <button
                id="hamburger"
                className="hamburger"
                type="button"
                aria-label="Deschide meniul"
                aria-controls="site-nav"
                aria-expanded={isMobileOpen}
                onClick={toggleMenu}
            >
                <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>

            <nav
                id="site-nav"
                className={`site-nav ${isMobileOpen ? "mobile" : ""}`}
                aria-label="Navigare principală"
                onClick={(e) => {
                    const target = e.target as HTMLElement | null;
                    if (target?.tagName === "A") closeMenu();
                }}
            >
                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/">
                    Acasă
                </NavLink>

                <NavLink
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    to="/destinations"
                >
                    Destinații
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/routes">
                    Rute
                </NavLink>

                {session?.role === "admin" && (
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/admin">
                        Admin
                    </NavLink>
                )}

                {!session ? (
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/login">
                        Login
                    </NavLink>
                ) : (
                    <button className="nav-link" style={{ cursor: "pointer" }} type="button" onClick={logout}>
                        Logout ({session.username})
                    </button>
                )}
            </nav>
        </header>
    );
}
