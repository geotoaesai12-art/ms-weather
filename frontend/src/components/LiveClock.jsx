import Icon from './Icon.jsx';
import { useNow } from '../hooks/useNow.js';

const TIME = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
const DATE = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Shows the visitor's own real local date and time, ticking every second.
export default function LiveClock() {
  const now = useNow(1000);
  const date = new Date(now);
  return (
    <div className="live-clock" aria-label="Your local date and time">
      <span className="live-clock__time">
        <Icon name="clock" size={18} />
        <time dateTime={date.toISOString()}>{TIME.format(date)}</time>
      </span>
      <span className="live-clock__date">
        <Icon name="calendar" size={16} />
        {DATE.format(date)}
      </span>
    </div>
  );
}
