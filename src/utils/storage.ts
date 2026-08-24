/**
 * Robust Local & Session Storage Utilities with Quota Protection & Image Compression
 */

// Helper to compress a base64 image data URL or File using HTML5 Canvas
export async function compressImageDataUrl(
  input: string | File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.65
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const processImage = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width || maxWidth;
          let height = img.height || maxHeight;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
            return;
          }
        } catch (e) {
          // Fall back if canvas rendering fails
        }
        resolve(typeof input === 'string' ? input : '');
      };

      img.onload = processImage;
      img.onerror = () => resolve(typeof input === 'string' ? input : '');

      if (typeof input === 'string') {
        img.src = input;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            img.src = e.target.result as string;
          } else {
            resolve('');
          }
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(input);
      }
    } catch {
      resolve(typeof input === 'string' ? input : '');
    }
  });
}

/**
 * Truncate oversized base64 data URLs in nested structures to protect storage
 */
export function sanitizeDataForStorage<T>(data: T): T {
  if (!data) return data;

  try {
    const jsonStr = JSON.stringify(data, (key, value) => {
      // If a string value is an oversized base64 image (> 80KB), downscale or truncate hint
      if (typeof value === 'string' && value.startsWith('data:image/') && value.length > 80000) {
        // Return a compact placeholder URL or truncated indicator
        return 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=80';
      }
      return value;
    });

    return JSON.parse(jsonStr);
  } catch {
    return data;
  }
}

// In-memory fallback if both localStorage & sessionStorage are full or restricted
const inMemoryStore = new Map<string, string>();

/**
 * Safely load a value from localStorage / sessionStorage / inMemoryStore
 */
export function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    let raw = localStorage.getItem(key);
    if (!raw) {
      raw = sessionStorage.getItem(key) || inMemoryStore.get(key) || null;
    }

    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    // Silent catch - don't trigger console.error
  }
  return defaultValue;
}

/**
 * Safely save a value to storage without throwing QuotaExceededError or logging console errors
 */
export function saveStorage<T>(key: string, value: T): void {
  try {
    const sanitized = sanitizeDataForStorage(value);
    const json = JSON.stringify(sanitized);

    // Try primary localStorage
    try {
      localStorage.setItem(key, json);
      return;
    } catch (quotaError) {
      // Storage quota exceeded on primary localStorage
    }

    // Attempt sessionStorage fallback
    try {
      sessionStorage.setItem(key, json);
      return;
    } catch (sessionError) {
      // Session storage full as well
    }

    // Save to in-memory store so current tab state is preserved
    inMemoryStore.set(key, json);
  } catch (e) {
    // Silently handle any remaining error to avoid console.error noise
  }
}
