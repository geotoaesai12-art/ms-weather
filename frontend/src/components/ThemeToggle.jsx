import Icon from './Icon.jsx';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`theme-switch${isDark ? ' theme-switch--dark' : ''}`}
      onClick={onToggle}
    >
      <span className="theme-switch__icon theme-switch__icon--sun" aria-hidden="true">
        <Icon name="brightness" size={22} />
      </span>
    </button>
  );
}
