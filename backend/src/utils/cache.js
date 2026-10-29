// Small in-memory cache with expiry.
export class TTLCache {
  constructor({ maxEntries = 500, now = () => Date.now() } = {}) {
    this.maxEntries = maxEntries;
    this.now = now;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key, value, ttlMs) {
    if (this.store.size >= this.maxEntries && !this.store.has(key)) this.prune();
    const storedAt = this.now();
    this.store.set(key, { value, storedAt, expiresAt: storedAt + ttlMs });
  }

  prune() {
    const now = this.now();
    for (const [key, entry] of this.store) {
      if (entry.expiresAt <= now) this.store.delete(key);
    }
    // still full: drop the oldest entry
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      this.store.delete(oldest);
    }
  }

  get size() {
    return this.store.size;
  }
}
