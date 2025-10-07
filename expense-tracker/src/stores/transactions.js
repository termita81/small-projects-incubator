import { writable, derived } from 'svelte/store';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage.js';

// Transaction store
function createTransactionStore() {
  const initialData = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
  const { subscribe, set, update } = writable(initialData);

  // Auto-save to localStorage on every change
  subscribe(value => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, value);
  });

  return {
    subscribe,
    set,
    add: (transaction) => update(transactions => {
      const newTransaction = {
        id: crypto.randomUUID(),
        ...transaction,
        timestamp: Date.now(),
        date: transaction.date || new Date().toISOString().split('T')[0]
      };
      return [newTransaction, ...transactions];
    }),
    update: (id, updates) => update(transactions =>
      transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    ),
    delete: (id) => update(transactions =>
      transactions.filter(t => t.id !== id)
    ),
    clear: () => set([])
  };
}

export const transactions = createTransactionStore();

// Summary calculations
export const summary = derived(transactions, ($transactions) => {
  const income = $transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = $transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses
  };
});
