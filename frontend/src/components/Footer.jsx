const quickLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#success-stories', label: 'Success Stories' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#how-it-works', label: 'How It Works' },
]

const social = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'Twitter' },
  { href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="global-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <a href="/" className="logo">
            <span className="logo-text">Muscle</span>
          </a>
          <p className="footer-tagline">Build your perfect body — your way.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map(({ href, label }) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p><a href="mailto:hello@muscle.example">hello@muscle.example</a></p>
          <p><a href="tel:+15551234567">+1 (555) 123-4567</a></p>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-links">
            {social.map(({ href, label }) => (
              <a key={label} href={href} aria-label={label}>{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <span className="copyright">© 2025 Muscle. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
