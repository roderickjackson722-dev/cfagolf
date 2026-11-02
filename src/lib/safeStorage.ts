// Browsers can block access to localStorage/sessionStorage (e.g. strict privacy
// settings, embedded iframes, some in-app browsers). Simply touching
// `window.sessionStorage` then throws a SecurityError and crashes the page.
// These wrappers fall back to in-memory storage so the app keeps working.

type SimpleStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function createSafeStorage(kind: 'localStorage' | 'sessionStorage'): SimpleStorage {
  const memory = new Map<string, string>();

  const resolve = (): Storage | null => {
    try {
      if (typeof window === 'undefined') return null;
      const storage = window[kind];
      const probe = '__cfa_storage_probe__';
      storage.setItem(probe, probe);
      storage.removeItem(probe);
      return storage;
    } catch {
      return null;
    }
  };

  return {
    getItem(key) {
      try {
        const s = resolve();
        if (s) return s.getItem(key);
      } catch {
        /* fall through */
      }
      return memory.has(key) ? memory.get(key)! : null;
    },
    setItem(key, value) {
      try {
        const s = resolve();
        if (s) {
          s.setItem(key, value);
          return;
        }
      } catch {
        /* fall through */
      }
      memory.set(key, String(value));
    },
    removeItem(key) {
      try {
        const s = resolve();
        if (s) s.removeItem(key);
      } catch {
        /* ignore */
      }
      memory.delete(key);
    },
  };
}

export const safeLocalStorage = createSafeStorage('localStorage');
export const safeSessionStorage = createSafeStorage('sessionStorage');
