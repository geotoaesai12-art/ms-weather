import { Link } from 'react-router-dom';
import MSLogo from './MSLogo.jsx';
import Icon from './Icon.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <MSLogo size={30} />
          <p>© {new Date().getFullYear()} MS Weather. All rights reserved.</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/privacy">
            <Icon name="shield" size={16} /> Privacy Policy
          </Link>
          <Link to="/terms">
            <Icon name="file" size={16} /> Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
