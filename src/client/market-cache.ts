/** IndexedDB persistence for complete catalogs and provider crawl checkpoints. */

const DATABASE_NAME = 'dsh-plugin-market'
const DATABASE_VERSION = 1
const STORE_NAME = 'catalogs'
const browserGlobals: { readonly indexedDB?: IDBFactory } = globalThis

/** Persistent storage used by the catalog API client. */
export interface MarketCatalogCache {
  /** Read the last complete catalog and any in-progress provider checkpoint. */
  load(): Promise<unknown>
  /** Atomically replace the catalog/checkpoint envelope. */
  save(value: unknown): Promise<void>
}

/** Resolve an IndexedDB request as a promise. */
function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => { resolve(request.result) }
    request.onerror = () => { reject(request.error ?? new Error('IndexedDB request failed')) }
  })
}

/** Open the marketplace cache and create its single object store on first use. */
function openDatabase(factory: IDBFactory): Promise<IDBDatabase> {
  const request = factory.open(DATABASE_NAME, DATABASE_VERSION)
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE_NAME)) {
      request.result.createObjectStore(STORE_NAME)
    }
  }
  return requestResult(request)
}

/** Wait for one IndexedDB transaction to commit. */
function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => { resolve() }
    transaction.onabort = () => { reject(transaction.error ?? new Error('IndexedDB transaction aborted')) }
    transaction.onerror = () => { reject(transaction.error ?? new Error('IndexedDB transaction failed')) }
  })
}

/**
 * Create a cache scoped to one normalized catalog base URL.
 *
 * @param key - normalized catalog base URL.
 * @param factory - browser IndexedDB implementation.
 * @returns the persistent catalog cache.
 */
export function createMarketCatalogCache(
  key: string,
  factory: IDBFactory | null = browserGlobals.indexedDB ?? null,
): MarketCatalogCache {
  return {
    async load() {
      if (factory === null) return null
      const database = await openDatabase(factory)
      try {
        const transaction = database.transaction(STORE_NAME, 'readonly')
        const value = await requestResult<unknown>(transaction.objectStore(STORE_NAME).get(key))
        return value ?? null
      } finally {
        database.close()
      }
    },
    async save(value) {
      if (factory === null) throw new Error('IndexedDB is unavailable')
      const database = await openDatabase(factory)
      try {
        const transaction = database.transaction(STORE_NAME, 'readwrite')
        transaction.objectStore(STORE_NAME).put(value, key)
        await transactionDone(transaction)
      } finally {
        database.close()
      }
    },
  }
}
