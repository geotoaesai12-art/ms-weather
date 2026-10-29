// Picks a visual mood for the current-weather card from the provider's icon code (e.g. "10d").
export function moodFromIcon(iconCode = '') {
  const group = iconCode.slice(0, 2);
  const night = iconCode.endsWith('n');
  if (['09', '10', '11'].includes(group)) return 'rain';
  if (group === '13') return 'snow';
  if (group === '50') return 'mist';
  if (['02', '03', '04'].includes(group)) return night ? 'night' : 'cloudy';
  return night ? 'night' : 'sunny';
}
