import Icon from './Icon.jsx';
import LiveClock from './LiveClock.jsx';

export default function PageHeader({ icon, title, subtitle }) {
  return (
    <header className="page-header">
      <div className="container page-header__inner">
        <span className="page-header__icon">
          <Icon name={icon} size={30} />
        </span>
        <div className="page-header__text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <LiveClock />
      </div>
    </header>
  );
}
