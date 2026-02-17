type SiteFooterProps = {
  yearText: string
  showTagline?: boolean
}

export function SiteFooter({ yearText, showTagline = false }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <strong>Moldova Travel</strong>
          <div className="muted">{showTagline ? `${yearText} | Calatoreste local, traieste autentic` : yearText}</div>
        </div>

        <div className="footer-right" aria-label="Social media">
          <a className="social" href="https://www.instagram.com/explore/tags/moldovatravel/" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a className="social" href="https://www.facebook.com/search/top?q=moldova%20travel" aria-label="Facebook">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a className="social" href="https://www.youtube.com/results?search_query=moldova+travel" aria-label="YouTube">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}
