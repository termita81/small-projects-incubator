import { writable } from 'svelte/store';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage.js';

const defaultCategories = [
  'Groceries',
  'Utilities',
  'Entertainment',
  'Transport',
  'Healthcare',
  'Shopping',
  'Dining',
  'Rent',
  'Salary',
  'Other'
];

function createCategoryStore() {
  const initialData = loadFromStorage(STORAGE_KEYS.CATEGORIES, defaultCategories);
  const { subscribe, set, update } = writable(initialData);

  // Auto-save to localStorage on every change
  subscribe(value => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, value);
  });

  return {
    subscribe,
    set,
    add: (category) => update(cats => {
      if (!cats.includes(category)) {
        return [...cats, category].sort();
      }
      return cats;
    }),
    remove: (category) => update(cats =>
      cats.filter(c => c !== category)
    ),
    reset: () => set(defaultCategories)
  };
}

export const categories = createCategoryStore();
