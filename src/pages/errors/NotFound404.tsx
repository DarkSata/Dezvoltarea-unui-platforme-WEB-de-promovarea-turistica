/* File: src/pages/errors/NotFound404.tsx */
import { Link } from "react-router-dom";

export default function NotFound404() {
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ marginTop: 0 }}>404 Not Found</h2>
                            <p className="muted">Pagina nu există.</p>
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
