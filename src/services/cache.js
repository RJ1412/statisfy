import { openDB } from 'idb';

const DB_NAME = 'spotify-analytics-cache';
const DB_VERSION = 1;
const STORE_NAME = 'api-cache';

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch(err => {
      console.warn('IndexedDB initialization failed. Caching will be disabled.', err);
      return null;
    });
  }
  return dbPromise;
}

export async function setCache(key, data, ttlHours = 24) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const expiresAt = Date.now() + (ttlHours * 60 * 60 * 1000);
    const payload = {
      data,
      expiresAt
    };
    
    await db.put(STORE_NAME, payload, key);
  } catch (error) {
    console.warn('Failed to set cache:', error);
  }
}

export async function getCache(key) {
  try {
    const db = await getDb();
    if (!db) return null;
    
    const record = await db.get(STORE_NAME, key);
    if (!record) return null;
    
    if (Date.now() > record.expiresAt) {
      await db.delete(STORE_NAME, key);
      return null;
    }
    
    return record.data;
  } catch (error) {
    console.warn('Failed to get cache:', error);
    return null;
  }
}

export async function clearCache() {
  try {
    const db = await getDb();
    if (!db) return;
    await db.clear(STORE_NAME);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}
