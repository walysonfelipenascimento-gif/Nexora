const DATABASE_NAME = "nexora-media-v1";
const STORE_NAME = "media";
const VIDEO_PREFIX = "nexora-idb-video:";
const resolvedUrlCache = new Map<string, string>();

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Este navegador não oferece armazenamento local de mídia."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Não foi possível abrir o armazenamento de mídia."));
    request.onblocked = () => reject(new Error("O armazenamento de mídia está ocupado por outra aba."));
  });
}

/** Guarda o Blob no IndexedDB e devolve uma referência pequena para o perfil. */
export async function saveProfileMedia(file: Blob): Promise<string> {
  const database = await openMediaDatabase();
  const key = `video-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Não foi possível salvar o vídeo."));
    transaction.onabort = () => reject(transaction.error || new Error("O salvamento do vídeo foi cancelado."));
  }).finally(() => database.close());

  return VIDEO_PREFIX + key;
}

/** Converte referências IndexedDB em URLs temporárias reproduzíveis no navegador. */
export async function resolveProfileMedia(media: string): Promise<string> {
  if (!media.startsWith(VIDEO_PREFIX)) return media;

  const key = media.slice(VIDEO_PREFIX.length);
  if (!key) return "";
  const cachedUrl = resolvedUrlCache.get(key);
  if (cachedUrl) return cachedUrl;

  let database: IDBDatabase;
  try {
    database = await openMediaDatabase();
  } catch {
    return "";
  }

  return new Promise((resolve) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => {
      const value = request.result;
      if (value instanceof Blob) {
        const url = URL.createObjectURL(value);
        resolvedUrlCache.set(key, url);
        resolve(url);
      } else {
        resolve("");
      }
      database.close();
    };
    request.onerror = () => {
      database.close();
      resolve("");
    };
    transaction.onabort = () => {
      database.close();
      resolve("");
    };
  });
}

export function isIndexedProfileMedia(media: string | undefined): boolean {
  return typeof media === "string" && media.startsWith(VIDEO_PREFIX);
}
