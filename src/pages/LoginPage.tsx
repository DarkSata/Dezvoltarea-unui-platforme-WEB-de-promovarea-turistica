/* File: src/pages/LoginPage.tsx */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation() as { state?: { from?: string } };

    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("user123");
    const [error, setError] = useState<string | null>(null);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const session = authService.login(username.trim(), password);
        if (!session) {
            setError("Date greșite. Încearcă: admin/admin123 sau user/user123");
            return;
        }

        const to = location.state?.from || "/";
        navigate(to, { replace: true });
    }

    return (
        <main>
            <section className="page-hero">
                <div className="container">
                    <div className="section-head">
                        <h1>Login</h1>
                        <p>Mock login cu roluri: admin/user.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                                <label className="muted">
                                    Username
                                    <input
                                        style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </label>

                                <label className="muted">
                                    Password
                                    <input
                                        type="password"
                                        style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 12 }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </label>

                                {error && <div className="muted">{error}</div>}

                                <button className="btn primary" type="submit">
                                    Login
                                </button>

                                <div className="muted">
                                    Demo: <b>admin/admin123</b> sau <b>user/user123</b>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
