export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="muted">© {new Date().getFullYear()} Moldova Travel Demo</p>
        <div>
          <a className="social" href="#" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a className="social" href="#" aria-label="Instagram">
            <i className="fa-brands fa-instagram" aria-hidden="true"></i>
          </a>
          <a className="social" href="#" aria-label="YouTube">
            <i className="fa-brands fa-youtube" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
