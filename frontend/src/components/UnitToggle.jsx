export default function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {['C', 'F'].map((u) => (
        <button
          key={u}
          type="button"
          className={`unit-toggle__btn${unit === u ? ' unit-toggle__btn--active' : ''}`}
          aria-pressed={unit === u}
          onClick={() => onChange(u)}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}
