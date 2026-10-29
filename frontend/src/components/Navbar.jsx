import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MSLogo from './MSLogo.jsx';
import Icon from './Icon.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const LINKS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/about', label: 'About', icon: 'file-circle-info' },
  { to: '/contact', label: 'Contact', icon: 'phone-arrow-right' },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label="MS Weather home">
          <span className="brand__logo"><MSLogo size={46} /></span>
          <span className="brand__text">
            <span className="brand__name">MS Weather</span>
            <span className="brand__tag">Know the weather, plan your day</span>
          </span>
        </Link>

        <nav id="primary-nav" className={`nav${open ? ' nav--open' : ''}`} aria-label="Primary">
          {LINKS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              <Icon name={icon} size={19} />
              <span className="nav__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="icon-btn nav-toggle" aria-expanded={open}
            aria-controls="primary-nav" aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
