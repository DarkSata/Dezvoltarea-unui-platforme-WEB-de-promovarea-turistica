/* File: src/pages/errors/Forbidden403.tsx */
import { Link } from "react-router-dom";

export default function Forbidden403() {
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ marginTop: 0 }}>403 Forbidden</h2>
                            <p className="muted">Nu ai permisiune (rol greșit).</p>
                            <Link className="btn primary" to="/">
                                Înapoi acasă
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
