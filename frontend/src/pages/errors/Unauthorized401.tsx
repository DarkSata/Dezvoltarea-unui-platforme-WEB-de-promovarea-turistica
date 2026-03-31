/* File: src/pages/errors/Unauthorized401.tsx */
import { Link } from "react-router-dom";

export default function Unauthorized401() {
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ marginTop: 0 }}>401 Unauthorized</h2>
                            <p className="muted">Trebuie să te loghezi ca să vezi pagina.</p>
                            <Link className="btn primary" to="/login">
                                Mergi la Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
