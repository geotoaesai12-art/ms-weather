import Icon from './Icon.jsx';
import StatusIllustration from './StatusIllustration.jsx';
import { describeError } from '../utils/errors.js';

export default function StatusPanel({ error, onRetry, compact = false }) {
  const info = describeError(error);
  return (
    <div className={`card status-panel${compact ? ' status-panel--compact' : ''}`} role="alert">
      <StatusIllustration kind={info.kind} />
      <h2 className="status-panel__title">{info.title}</h2>
      <p className="status-panel__message">{info.message}</p>
      {info.canRetry && onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          <Icon name="refresh" size={18} />
          Try again
        </button>
      )}
    </div>
  );
}
