import { supabase } from './supabase';

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Enforce HTTPS in production builds
const API_URL =
  !__DEV__ && RAW_API_URL.startsWith('http://')
    ? RAW_API_URL.replace('http://', 'https://')
    : RAW_API_URL;

const MAX_RETRIES = 2;
const RETRY_BASE_MS = 800;

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers = await getAuthHeader();

      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        const err = new Error(error.error || `HTTP ${res.status}`);
        (err as any).status = res.status;
        (err as any).code = error.code;
        throw err;
      }

      if (res.status === 204) return undefined as T;
      return res.json();
    } catch (err: any) {
      lastError = err;
      // Don't retry on client errors (4xx) except 429 (rate limited)
      const status = err?.status;
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err;
      }
      // Don't retry on the last attempt
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
