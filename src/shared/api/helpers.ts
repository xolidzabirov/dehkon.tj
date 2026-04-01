/**
 * Universal API response extractor.
 *
 * Backend may return:
 *   1) Array directly: [item1, item2, ...]
 *   2) { items: [...], totalCount, ... }
 *   3) { isSuccess, data: { data: [...], totalPage, totalRecords, ... } }
 *   4) { isSuccess, data: T } (single object)
 *   5) { data: T } (just wrapped)
 *
 * This helper normalises all shapes into a consistent { items, totalCount } format.
 */

export interface ExtractedList<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
}

/** Extract an array of T from any backend response shape */
export function extractList<T = any>(raw: any): ExtractedList<T> {
  // 1) already an array
  if (Array.isArray(raw)) {
    return { items: raw, totalCount: raw.length, totalPages: 1, pageSize: raw.length, pageNumber: 1 };
  }

  if (!raw || typeof raw !== 'object') {
    return { items: [], totalCount: 0, totalPages: 0, pageSize: 10, pageNumber: 1 };
  }

  // 3) { isSuccess, data: { data: [...], totalPage, totalRecords } }
  if (raw.isSuccess !== undefined && raw.data) {
    const inner = raw.data;
    if (Array.isArray(inner.data)) {
      return {
        items: inner.data,
        totalCount: inner.totalRecords ?? inner.totalCount ?? inner.data.length,
        totalPages: inner.totalPage ?? inner.totalPages ?? 1,
        pageSize: inner.pageSize ?? inner.data.length,
        pageNumber: inner.pageNumber ?? 1,
      };
    }
    // data is a single object or array directly
    if (Array.isArray(inner)) {
      return { items: inner, totalCount: inner.length, totalPages: 1, pageSize: inner.length, pageNumber: 1 };
    }
  }

  // 2) { items: [...], totalCount, ... }
  if (Array.isArray(raw.items)) {
    return {
      items: raw.items,
      totalCount: raw.totalCount ?? raw.totalRecords ?? raw.items.length,
      totalPages: raw.totalPages ?? raw.totalPage ?? 1,
      pageSize: raw.pageSize ?? raw.items.length,
      pageNumber: raw.pageNumber ?? 1,
    };
  }

  // 5) { data: [...] }
  if (Array.isArray(raw.data)) {
    return { items: raw.data, totalCount: raw.data.length, totalPages: 1, pageSize: raw.data.length, pageNumber: 1 };
  }

  return { items: [], totalCount: 0, totalPages: 0, pageSize: 10, pageNumber: 1 };
}

/** Extract a single T from an ApiWrapper or raw response */
export function extractOne<T = any>(raw: any): T {
  if (raw?.isSuccess !== undefined && raw?.data !== undefined) {
    // { isSuccess, data: T } or { isSuccess, data: { data: T } }
    const inner = raw.data;
    if (inner && typeof inner === 'object' && 'data' in inner && !Array.isArray(inner.data)) {
      return inner.data as T;
    }
    return inner as T;
  }
  if (raw?.data !== undefined) {
    return raw.data as T;
  }
  return raw as T;
}
