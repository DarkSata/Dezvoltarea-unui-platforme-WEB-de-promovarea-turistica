/* File: src/pages/errors/ServerError500.tsx */
import { Link } from "react-router-dom";

export default function ServerError500() {
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ marginTop: 0 }}>500 Server Error</h2>
                            <p className="muted">Simulare eroare backend. Reîncearcă sau revino acasă.</p>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <Link className="btn primary" to="/destinations">
                                    Înapoi la Destinații
                                </Link>
                                <Link className="btn ghost" to="/">
                                    Acasă
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
