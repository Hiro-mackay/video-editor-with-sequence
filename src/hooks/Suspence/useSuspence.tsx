const cache: Record<string, any> = {};
const errorsCache: Record<string, Error | undefined> = {};
// <Suspense> catches the thrown promise
// and rerenders children when promise resolves
export const useSuspense = <T,>(importPromiseFunc: Promise<T> | (() => Promise<T>), cacheKey: string): T => {
  const cachedModule = cache[cacheKey];
  // already loaded previously
  if (cachedModule) return cachedModule;

  //prevents import() loop on failed imports
  if (errorsCache[cacheKey]) throw errorsCache[cacheKey];

  const importPromise = typeof importPromiseFunc === 'function' ? importPromiseFunc() : importPromiseFunc;

  // gets caught by Suspense
  // console.log('path.relative', path.relative('../', importPath));
  throw importPromise
    .then((mod) => (cache[cacheKey] = mod))
    .catch((err) => {
      errorsCache[cacheKey] = err;
    });
};
