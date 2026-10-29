import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../utils/storage.js';

const KEY = 'ms-weather:unit';

export function useUnit() {
  const [unit, setUnit] = useState(() => (storageGet(KEY) === 'F' ? 'F' : 'C'));
  useEffect(() => storageSet(KEY, unit), [unit]);
  return { unit, setUnit };
}
