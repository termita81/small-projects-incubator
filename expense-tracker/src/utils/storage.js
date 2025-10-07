const STORAGE_KEYS = {
  TRANSACTIONS: 'expense-tracker-transactions',
  CATEGORIES: 'expense-tracker-categories'
};

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export function clearStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export function exportData() {
  const data = {
    transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
    categories: loadFromStorage(STORAGE_KEYS.CATEGORIES, []),
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (data.transactions) {
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
    }

    if (data.categories) {
      saveToStorage(STORAGE_KEYS.CATEGORIES, data.categories);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error: error.message };
  }
}

export { STORAGE_KEYS };
