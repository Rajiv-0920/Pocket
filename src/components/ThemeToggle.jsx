import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const { appearance } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const isDark = appearance === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-8 w-14 items-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-0.5 transition-colors duration-300 shrink-0"
    >
      {/* Track icons */}
      <Sun
        className="absolute left-1.5 h-3.5 w-3.5 text-amber-400 transition-opacity duration-200"
        style={{ opacity: isDark ? 0.3 : 1 }}
      />
      <Moon
        className="absolute right-1.5 h-3.5 w-3.5 text-indigo-400 transition-opacity duration-200"
        style={{ opacity: isDark ? 1 : 0.3 }}
      />
      {/* Thumb */}
      <span
        className="absolute h-6 w-6 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-600 transition-all duration-300"
        style={{ left: isDark ? 'calc(100% - 1.75rem)' : '0.125rem' }}
      />
    </button>
  );
};

export default ThemeToggle;
