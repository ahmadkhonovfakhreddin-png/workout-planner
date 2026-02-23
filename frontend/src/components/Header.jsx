import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#success-stories', label: 'Success Stories' },
    { href: '#pricing', label: 'Pricing' },
  ]
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
        </nav>
        <a href="#pricing" className="btn btn-header-cta">Get Started</a>
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
        <a href="#pricing" className="btn" onClick={() => setMenuOpen(false)}>Get Started</a>
      </nav>
    </header>
  )
}
