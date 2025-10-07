import { writable } from 'svelte/store';

const THEME_KEY = 'expense-tracker-theme';

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

function createThemeStore() {
  const { subscribe, set, update } = writable(getInitialTheme());

  return {
    subscribe,
    toggle: () => {
      update(current => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
          localStorage.setItem(THEME_KEY, newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    },
    set: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    },
    init: () => {
      const theme = getInitialTheme();
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
