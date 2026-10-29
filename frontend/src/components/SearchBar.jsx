import { useId, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { MAX_CITY_LENGTH, validateCity } from '../utils/validation.js';

export default function SearchBar({ onSearch, onClear, onUseLocation, busy = false }) {
  const [value, setValue] = useState('');
  const [problem, setProblem] = useState(null);
  const inputRef = useRef(null);
  const baseId = useId();
  const inputId = `${baseId}-city`;
  const errorId = `${baseId}-error`;

  function submit(raw) {
    const result = validateCity(raw);
    if (!result.ok) {
      setProblem(result.message);
      return;
    }
    setProblem(null);
    onSearch(result.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit(value);
  }


  function handleClear() {
    setValue('');
    setProblem(null);
    onClear();
    inputRef.current?.focus();
  }

  return (
    <div className="search">
      <form className="search__form" role="search" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="visually-hidden">
          City name
        </label>
        <Icon name="search" size={22} className="search__icon" />
        <input
          ref={inputRef}
          id={inputId}
          className="search__input"
          type="text"
          value={value}
          maxLength={MAX_CITY_LENGTH}
          placeholder="Search for a city"
          autoComplete="off"
          aria-invalid={problem ? 'true' : 'false'}
          aria-describedby={problem ? errorId : undefined}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button type="button" className="search__clear" onClick={handleClear} aria-label="Clear search">
            <Icon name="close" size={18} />
          </button>
        )}
        <button type="submit" className="btn btn--primary search__submit" disabled={busy}>
          Search
        </button>
      </form>

      {problem && (
        <p id={errorId} className="search__problem" role="alert">
          {problem}
        </p>
      )}

      <div className="search__extras">
        <button type="button" className="btn btn--ghost" onClick={onUseLocation} disabled={busy}>
          <Icon name="locate" size={18} />
          Use My Location
        </button>
      </div>

    </div>
  );
}
