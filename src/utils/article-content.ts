/** @format */

import { API_URL } from './constants';

const FILES_PREFIX = `${API_URL.replace(/\/$/, '')}/files`;

/**
 * Resolve /storage/... image paths to full URLs for display in Summernote.
 */
export function resolveContentImageUrls(html: string): string {
  if (!html) return '';

  return html.replace(
    /<img([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      const resolved = resolveImageSrc(src);
      return `<img${attrs} src="${resolved}"`;
    }
  );
}

/**
 * Convert full file URLs back to /storage/... paths for API storage.
 */
export function normalizeContentImageUrls(html: string): string {
  if (!html) return '';

  return html.replace(
    /<img([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      const normalized = normalizeImageSrc(src);
      return `<img${attrs} src="${normalized}"`;
    }
  );
}

export function resolveImageSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    // Fix URLs that point to API host without /files
    const apiBase = API_URL.replace(/\/$/, '');
    if (src.startsWith(apiBase) && !src.includes('/files/')) {
      const path = src.slice(apiBase.length);
      if (path.startsWith('/storage/')) {
        return `${FILES_PREFIX}${path}`;
      }
    }
    // Already a full files URL
    if (src.includes('/files/')) return src;
    return src;
  }
  if (src.startsWith('/storage/')) {
    return `${FILES_PREFIX}${src}`;
  }
  if (src.startsWith('/files/')) {
    return `${API_URL.replace(/\/$/, '')}${src}`;
  }
  return src;
}

export function normalizeImageSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith('data:')) return src;

  const apiBase = API_URL.replace(/\/$/, '');
  if (src.startsWith(apiBase)) {
    const path = src.slice(apiBase.length);
    if (path.startsWith('/files/storage/')) {
      return path.replace('/files', '');
    }
    if (path.startsWith('/files/image/storage/')) {
      return path.replace('/files/image', '');
    }
    if (path.startsWith('/storage/')) {
      return path;
    }
  }

  if (src.startsWith('/files/storage/')) {
    return src.replace('/files', '');
  }
  if (src.startsWith('/files/image/storage/')) {
    return src.replace('/files/image', '');
  }

  return src;
}

export function buildFileUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/storage/')) {
    return `${FILES_PREFIX}${path}`;
  }
  return `${FILES_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}
