import LZString from 'lz-string';

const compressFn = LZString?.compressToEncodedURIComponent || LZString?.default?.compressToEncodedURIComponent;
const decompressFn = LZString?.decompressFromEncodedURIComponent || LZString?.default?.decompressFromEncodedURIComponent;

/**
 * Encode greeting data into a URL-safe compressed string.
 * Uses LZ-string with safe JSON fallback.
 */
export function encodeGreeting(data) {
  const compact = {
    r: (data.recipientName || '').trim(),
    s: (data.senderName || '').trim(),
    m: (data.message || '').trim(),
    d: data.diyaStyle || 'classic',
    t: data.bgTheme || 'ethereal',
    n: Number(data.diyas) || 3,
    b: data.boxStyle || 'square',
  };

  const json = JSON.stringify(compact);
  if (typeof compressFn === 'function') {
    try {
      const compressed = compressFn(json);
      if (compressed) return compressed;
    } catch (e) {
      console.warn('LZString compression failed, using base64 fallback:', e);
    }
  }

  // Safe fallback if compression fails
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}

/**
 * Decode greeting data from a URL-safe compressed string.
 */
export function decodeGreeting(encoded) {
  if (!encoded) return null;

  try {
    let json = null;
    if (typeof decompressFn === 'function') {
      try {
        json = decompressFn(encoded);
      } catch {
        json = null;
      }
    }

    // Try base64 fallback if LZString did not match
    if (!json) {
      try {
        json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
      } catch {
        json = null;
      }
    }

    if (!json) return null;

    const compact = JSON.parse(json);
    return {
      recipientName: compact.r || 'Friend',
      senderName: compact.s || '',
      message: compact.m || '',
      diyaStyle: compact.d || 'classic',
      bgTheme: compact.t || 'ethereal',
      diyas: compact.n || 3,
      boxStyle: compact.b || 'square',
      photo: null,
    };
  } catch (e) {
    console.error('Failed to decode greeting:', e);
    return null;
  }
}
