import { useCallback, useEffect, useState } from 'react';
import { storageSet } from '../utils/storage.js';

const KEY = 'ms-weather:theme';

export function useTheme() {
  // Start from what theme-init.js already applied, so the first render never disagrees with the page.
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storageSet(KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggleTheme };
}
