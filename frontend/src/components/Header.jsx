import { useState } from 'react'

export default function Header({ user, onGetStarted, onGoToPortal }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#success-stories', label: 'Success Stories' },
    { href: '#pricing', label: 'Pricing' },
  ]
  const handleGetStarted = (e) => {
    e?.preventDefault?.()
    if (onGetStarted) onGetStarted()
    setMenuOpen(false)
  }
  const handlePortal = (e) => {
    e?.preventDefault?.()
    if (onGoToPortal) onGoToPortal()
    setMenuOpen(false)
  }
  return (
    <header className="global-header" id="global-header">
      <div className="header-inner">
        <a href="/" className="logo" aria-label="Muscle Home">
          <span className="logo-text">Muscle</span>
        </a>
        <nav className="nav-desktop" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
          {onGoToPortal && (
            <button type="button" className="header-portal-link" onClick={handlePortal}>My Portal</button>
          )}
        </nav>
        <button type="button" className="btn btn-header-cta" onClick={handleGetStarted}>Get Started</button>
        <button
          type="button"
          className={'hamburger ' + (menuOpen ? 'open' : '')}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav
        className="nav-mobile"
        id="nav-mobile"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        style={{ display: menuOpen ? 'flex' : 'none' }}
      >
        {navLinks.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        {onGoToPortal && (
          <button type="button" className="header-portal-link" onClick={handlePortal}>My Portal</button>
        )}
        <button type="button" className="btn btn-header-cta" onClick={handleGetStarted}>Get Started</button>
      </nav>
    </header>
  )
}
