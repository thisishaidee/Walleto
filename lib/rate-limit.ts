type Bucket = { count: number; resetAt: number };

const hits = new Map<string, Bucket>();
const results = new Map<string, { expires: number; payload: unknown }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = hits.get(key);
  if (!bucket || now > bucket.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export function getCached<T>(key: string): T | null {
  const hit = results.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    results.delete(key);
    return null;
  }
  return hit.payload as T;
}

export function setCached<T>(key: string, payload: T, ttlMs = 25_000) {
  results.set(key, { expires: Date.now() + ttlMs, payload });
}
