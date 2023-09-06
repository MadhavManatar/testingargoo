export enum DBStores {
  FILES = 'files',
}

export const DBStoresKEY = {
  files: 'path',
};

const DB_NAME = 'SmackDabDB';

export const getDBInstance = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME);

    request.onupgradeneeded = () => {
      const db = request.result;
      Object.values(DBStores).forEach((store) => {
        if (!db.objectStoreNames.contains(store) && DBStoresKEY[store]) {
          db.createObjectStore(store, { keyPath: DBStoresKEY[store] });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      console.log(request.error?.message || 'IndexDB: Unknown Error.');
      resolve(null);
    };
  });
};

export const clearIndexDBStorage = () => {
  indexedDB.deleteDatabase(DB_NAME);
};

export const addData = async (storeName: DBStores, data: any) => {
  const db = await getDBInstance();
  const isValidStore = DBStoresKEY[storeName];

  if (!db || !isValidStore) return null;

  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const request = transaction.objectStore(storeName).add(data);

    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
    transaction.oncomplete = () => db.close();
  });
};

export const getData = async (storeName: DBStores, key: string) => {
  const db = await getDBInstance();
  const isValidStore = DBStoresKEY[storeName];

  if (!db || !isValidStore) return null;

  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const request = transaction.objectStore(storeName).get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
    transaction.oncomplete = () => db.close();
  });
};

export const removeData = async (storeName: DBStores, key: string) => {
  const db = await getDBInstance();
  const isValidStore = DBStoresKEY[storeName];

  if (!db || !isValidStore) return null;

  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const request = transaction.objectStore(storeName).delete(key);

    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
    transaction.oncomplete = () => db.close();
  });
};
