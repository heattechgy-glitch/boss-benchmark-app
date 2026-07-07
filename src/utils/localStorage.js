const STORAGE_KEYS = {
  BENCHMARK_RESULTS: 'boss_benchmark_results',
  USER_PREFERENCES: 'boss_user_preferences',
  SESSION_DATA: 'boss_session_data',
  CACHE_TIMESTAMP: 'boss_cache_timestamp'
};

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const localStorageService = {
  set(key, value) {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now()
      });
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('localStorage set error:', error);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      return parsed.data !== undefined ? parsed.data : parsed;
    } catch (error) {
      console.error('localStorage get error:', error);
      return defaultValue;
    }
  },

  getWithExpiry(key, defaultValue = null, expiryMs = CACHE_EXPIRY_MS) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      const now = Date.now();
      
      if (parsed.timestamp && (now - parsed.timestamp) > expiryMs) {
        this.remove(key);
        return defaultValue;
      }
      
      return parsed.data !== undefined ? parsed.data : parsed;
    } catch (error) {
      console.error('localStorage getWithExpiry error:', error);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('localStorage remove error:', error);
      return false;
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('localStorage clear error:', error);
      return false;
    }
  },

  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('localStorage clearAll error:', error);
      return false;
    }
  },

  has(key) {
    return localStorage.getItem(key) !== null;
  },

  getSize() {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage.getItem(key).length * 2; // UTF-16 chars = 2 bytes
      }
    }
    return total;
  },

  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
};

export const benchmarkStorage = {
  saveResults(results) {
    return localStorageService.set(STORAGE_KEYS.BENCHMARK_RESULTS, results);
  },

  getResults() {
    return localStorageService.get(STORAGE_KEYS.BENCHMARK_RESULTS, []);
  },

  addResult(result) {
    const results = this.getResults();
    const newResult = {
      ...result,
      id: `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    results.push(newResult);
    this.saveResults(results);
    return newResult;
  },

  removeResult(id) {
    const results = this.getResults();
    const filtered = results.filter(r => r.id !== id);
    return this.saveResults(filtered);
  },

  clearResults() {
    return localStorageService.remove(STORAGE_KEYS.BENCHMARK_RESULTS);
  }
};

export const preferencesStorage = {
  save(preferences) {
    return localStorageService.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  get() {
    return localStorageService.get(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      language: 'en',
      notifications: true,
      autoSave: true
    });
  },

  update(partialPreferences) {
    const current = this.get();
    return this.save({ ...current, ...partialPreferences });
  }
};

export const sessionStorage = {
  save(data) {
    return localStorageService.set(STORAGE_KEYS.SESSION_DATA, data);
  },

  get() {
    return localStorageService.getWithExpiry(STORAGE_KEYS.SESSION_DATA, null);
  },

  clear() {
    return localStorageService.remove(STORAGE_KEYS.SESSION_DATA);
  }
};

export { STORAGE_KEYS };
export default localStorageService;