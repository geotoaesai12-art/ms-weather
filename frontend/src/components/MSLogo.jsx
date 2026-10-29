export default function MSLogo({ size = 40 }) {
  // Compact, high-contrast monogram designed to remain readable in the header and footer.
  return (
    <svg
      className="ms-logo"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="MS Weather logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="msLogoRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF3030" />
          <stop offset="100%" stopColor="#830000" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#0B0808" stroke="#BC0202" strokeWidth="2" />
      <circle cx="46" cy="17" r="8" fill="#FF0000" />
      <g stroke="#FF5555" strokeWidth="2" strokeLinecap="round">
        <path d="M46 4v3M46 27v3M33 17h3M56 17h3M37 8l2 2M53 24l2 2" />
      </g>
      <path d="M11 43V24l10 12 10-12v19" fill="none" stroke="#FFFFFF" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M51 29c-4-4-13-3-13 3 0 6 13 4 13 10 0 6-9 8-15 3" fill="none" stroke="url(#msLogoRed)" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M11 47h38" stroke="#BC0202" strokeWidth="2" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}
