// One consistent set of line icons (24x24, 1.8 stroke). Usage: <Icon name="home" size={20} />
const PATHS = {
  home: (<><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V10" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.6" r="0.6" fill="currentColor" /></>),
  'circle-info': (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="7.5" r="0.7" fill="currentColor" /></>),
  'file-circle-info': (<><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="M13 3v5h5" /><path d="M13 3l5 5" /><circle cx="16.5" cy="16.5" r="5.5" /><path d="M16.5 15.5v3" /><circle cx="16.5" cy="13.5" r="0.35" fill="currentColor" /></>),
  'toggle-on': (<><rect x="2.5" y="6" width="19" height="12" rx="6" /><circle cx="15.5" cy="12" r="4" fill="currentColor" stroke="none" /></>),
  'toggle-off': (<><rect x="2.5" y="6" width="19" height="12" rx="6" /><circle cx="8.5" cy="12" r="4" fill="currentColor" stroke="none" /></>),
  brightness: (<><circle cx="12" cy="12" r="3.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>),
  'phone-arrow-right': (<><path d="M8.5 3.5 6 3a2 2 0 0 0-2.2 2.4c1.2 7.1 7.7 13.6 14.8 14.8A2 2 0 0 0 21 18l-.5-2.5-4-1-2 2a14 14 0 0 1-5-5l2-2z" /><path d="M14 4h6v6M20 4l-7 7" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>),
  moon: (<path d="M20.5 13.3A8.5 8.5 0 1 1 10.7 3.5a6.8 6.8 0 0 0 9.8 9.8z" />),
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.9-3.9" /></>),
  close: (<path d="M6 6l12 12M18 6 6 18" />),
  menu: (<path d="M4 7h16M4 12h16M4 17h16" />),
  pin: (<><path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  locate: (<><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" /></>),
  thermometer: (<><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" /><path d="M12 9v7" /></>),
  droplet: (<path d="M12 3.2s6 6.3 6 10.6a6 6 0 0 1-12 0C6 9.5 12 3.2 12 3.2z" />),
  wind: (<><path d="M3 9h10.5a2.5 2.5 0 1 0-2.4-3.1" /><path d="M3 14h14a2.5 2.5 0 1 1-2.4 3.1" /><path d="M3 19h6" /></>),
  gauge: (<><path d="M4.5 17.5a8.5 8.5 0 1 1 15 0" /><path d="m12 13 3.5-4" /><circle cx="12" cy="13.5" r="1" fill="currentColor" /></>),
  eye: (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>),
  sunrise: (<><path d="M12 3v4M5.6 8.6l1.5 1.5M18.4 8.6l-1.5 1.5M2.5 17.5h2.5M19 17.5h2.5" /><path d="M7 17.5a5 5 0 0 1 10 0" /><path d="M3 21h18" /></>),
  sunset: (<><path d="M12 7V3M5.6 8.6l1.5 1.5M18.4 8.6l-1.5 1.5M2.5 17.5h2.5M19 17.5h2.5" /><path d="M7 17.5a5 5 0 0 1 10 0" /><path d="M3 21h18" /><path d="m9.5 5.5 2.5 2.5 2.5-2.5" /></>),
  compass: (<><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>),
  cloud: (<path d="M7 18.5a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.8 8.6 4.9 4.9 0 0 1 17.5 18.5z" />),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  shield: (<><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></>),
  file: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  refresh: (<><path d="M20 11a8 8 0 0 0-14.3-4.4L4 8.5" /><path d="M4 4v4.5h4.5" /><path d="M4 13a8 8 0 0 0 14.3 4.4L20 15.5" /><path d="M20 20v-4.5h-4.5" /></>),
  bolt: (<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></>),
  layers: (<><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>),
  palette: (<><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1.3-1.5-1.3-2.8 0-1 .8-1.7 1.9-1.7H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10" cy="7.5" r="1" fill="currentColor" /><circle cx="15" cy="7.5" r="1" fill="currentColor" /></>),
  arrowRight: (<path d="M5 12h14M13 6l6 6-6 6" />),
};

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
