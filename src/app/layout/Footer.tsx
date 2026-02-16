/* File: src/app/layout/Footer.tsx */

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-left">
                    <strong>Moldova Travel</strong>
                    <div className="muted">{new Date().getFullYear()} ©</div>
                </div>
            </div>
        </footer>
    );
}
