import { env } from '@/data/env/server';
import {
  buildMemoryStorage,
  CacheUpdater,
  MemoryStorage,
  setupCache,
} from 'axios-cache-interceptor';
import Axios from 'axios';

/**
 * Since I implemented a custom cache invalidation and "importing"
 * the instance of the axios cache creates multiple copies of it,
 * I instead made it the underlying storage globally available.
 *
 * This is in no way will be in the final production code.
 * Once the backend has the features I need, I will remove this.
 */
declare global {
  // eslint-disable-next-line no-var
  var storage: MemoryStorage;
}

globalThis.storage = globalThis.storage ?? buildMemoryStorage(false, 1000 * 10); // 10 minutes

const axios = Axios.create({
  baseURL: env.DB_BASE_URL,
});

const instance = setupCache(axios, { storage });

if (env.NODE_ENV === 'development') {
  instance.interceptors.request.use((request) => {
    console.log(`[REQ]: ${request.method?.toUpperCase()} ${request.url}`);
    return request;
  });

  instance.interceptors.response.use((response) => {
    console.log(
      `${response.cached ? '[CACHED]' : ''}[RES]: ${response.config.url}`
    );
    return response;
  });
}

export const createCacheId = (keys: (string | number)[]): string =>
  keys.join('-');

export const createInvalidateUpdateCache = async <R, D>(
  ...idsKeys: (string | number)[][]
): Promise<CacheUpdater<R, D>> => {
  const cache: Record<string, 'delete'> = {};
  const cachedIds = Object.keys(storage.data);

  for (const idKeys of idsKeys) {
    const idToInvalidate = createCacheId(idKeys);
    for (const cachedId of cachedIds) {
      if (!cachedId.startsWith(idToInvalidate)) continue;
      cache[cachedId] = 'delete';
      console.log('REMOVE ID:', cachedId);
      delete storage.data[idToInvalidate];
    }
  }

  return cache;
};

export default instance;
