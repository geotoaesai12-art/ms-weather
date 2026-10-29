// Small custom illustrations for empty and error states.
export default function StatusIllustration({ kind = 'cloud' }) {
  return (
    <svg className="status-illustration" width="120" height="96" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <g fill="#cfe3ff">
        <circle cx="42" cy="56" r="16" />
        <circle cx="62" cy="46" r="22" />
        <circle cx="84" cy="58" r="14" />
        <rect x="42" y="56" width="42" height="16" />
      </g>
      {kind === 'search' && (
        <g fill="none" stroke="#2f8bff" strokeWidth="5" strokeLinecap="round">
          <circle cx="66" cy="50" r="12" />
          <path d="M75 59l12 12" />
        </g>
      )}
      {kind === 'offline' && (
        <g stroke="#ff6b6b" strokeWidth="5" strokeLinecap="round">
          <path d="M44 28l44 52" />
        </g>
      )}
      {kind === 'location' && (
        <g>
          <path d="M66 24c-8 0-14 6-14 14 0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14z" fill="#2f8bff" />
          <circle cx="66" cy="38" r="5" fill="#ffffff" />
        </g>
      )}
      {kind === 'cloud' && (
        <g fill="#ffb020">
          <circle cx="96" cy="22" r="9" />
        </g>
      )}
    </svg>
  );
}
