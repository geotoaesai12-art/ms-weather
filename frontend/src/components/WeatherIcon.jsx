// Icons are chosen from the provider's icon code (e.g. "10d" = rain, day), so they always match the real conditions.
const CLOUD_FILL = '#cfe3ff';
const CLOUD_DARK = '#8fa9cf';
const SUN = '#ffb020';
const RAIN = '#5aa9ff';

function Cloud({ x = 0, y = 0, fill = CLOUD_FILL }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill}>
      <circle cx="22" cy="34" r="9" />
      <circle cx="33" cy="28" r="12" />
      <circle cx="45" cy="35" r="8" />
      <rect x="22" y="35" width="23" height="8" />
    </g>
  );
}

function Sun({ cx = 32, cy = 32, r = 10 }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * (r + 4);
    const y1 = cy + Math.sin(a) * (r + 4);
    const x2 = cx + Math.cos(a) * (r + 8);
    const y2 = cy + Math.sin(a) * (r + 8);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={SUN} />
      <g stroke={SUN} strokeWidth="3" strokeLinecap="round">
        {rays}
      </g>
    </g>
  );
}

function Moon({ x = 0, y = 0, scale = 1 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M38 10a20 20 0 1 0 16 28A16 16 0 0 1 38 10z"
      fill="#f2e6a8"
    />
  );
}

function Drops({ count = 3 }) {
  const xs = [26, 34, 42, 30, 38].slice(0, count);
  return (
    <g stroke={RAIN} strokeWidth="3" strokeLinecap="round">
      {xs.map((x, i) => (
        <line key={x} x1={x} y1={44 + (i % 2) * 4} x2={x - 3} y2={52 + (i % 2) * 4} />
      ))}
    </g>
  );
}

function Flakes() {
  return (
    <g fill="#ffffff">
      {[26, 34, 42].map((x, i) => (
        <circle key={x} cx={x} cy={47 + (i % 2) * 5} r="2.5" />
      ))}
    </g>
  );
}

function Scene({ group, night }) {
  switch (group) {
    case '01':
      return night ? <Moon x={2} y={4} scale={1} /> : <Sun />;
    case '02':
      return (
        <>
          {night ? <Moon x={-4} y={-4} scale={0.8} /> : <Sun cx={24} cy={24} r={9} />}
          <Cloud x={4} y={6} />
        </>
      );
    case '03':
      return <Cloud y={2} />;
    case '04':
      return (
        <>
          <Cloud x={-6} y={-4} fill={CLOUD_DARK} />
          <Cloud x={6} y={6} />
        </>
      );
    case '09':
      return (
        <>
          <Cloud y={-6} fill={CLOUD_DARK} />
          <Drops count={5} />
        </>
      );
    case '10':
      return (
        <>
          {night ? <Moon x={-8} y={-8} scale={0.7} /> : <Sun cx={22} cy={20} r={8} />}
          <Cloud x={4} y={-4} />
          <Drops count={3} />
        </>
      );
    case '11':
      return (
        <>
          <Cloud y={-8} fill={CLOUD_DARK} />
          <polygon points="34,36 26,50 33,50 30,60 43,43 36,43 39,36" fill={SUN} />
        </>
      );
    case '13':
      return (
        <>
          <Cloud y={-6} />
          <Flakes />
        </>
      );
    case '50':
      return (
        <g stroke={CLOUD_DARK} strokeWidth="4" strokeLinecap="round">
          <line x1="12" y1="24" x2="52" y2="24" />
          <line x1="18" y1="34" x2="56" y2="34" />
          <line x1="12" y1="44" x2="48" y2="44" />
        </g>
      );
    default:
      return <Cloud y={2} />;
  }
}

export default function WeatherIcon({ code = '', label = '', size = 56 }) {
  const group = code.slice(0, 2);
  const night = code.endsWith('n');
  return (
    <svg
      className="weather-icon"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      <Scene group={group} night={night} />
    </svg>
  );
}
