import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import StatusIllustration from '../components/StatusIllustration.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function NotFoundPage() {
  usePageTitle('Page not found – MS Weather');
  return (
    <div className="container page-body page-body--center">
      <StatusIllustration kind="search" />
      <h1>404 – Page not found</h1>
      <p className="lead">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn--primary">
        <Icon name="home" size={18} /> Back to home
      </Link>
    </div>
  );
}
