import { ENDPOINTS } from '../utils/constants';
import type { Snapshot, FinalizeBuildResponse } from '../types';

/**
 * All communication with the Go backend lives here. This file knows nothing
 * about Percy — it only knows the backend's HTTP contract:
 *   POST   /snapshots
 *   GET    /snapshots
 *   DELETE /snapshots
 *   POST   /build/finalize
 *   GET    /health
 */

async function parseJsonOrThrow(response: Response): Promise<unknown> {
if (!response.ok) {
  const body = await response.text().catch(() => '');
  throw new Error(`Backend request failed (${response.status}): ${body || response.statusText}`);
}
return response.json().catch(() => ({}));
}

export async function checkHealth(): Promise<boolean> {
try {
  const response = await fetch(ENDPOINTS.HEALTH, { method: 'GET' });
  return response.ok;
} catch {
  return false;
}
}

export async function createSnapshot(snapshot: Snapshot): Promise<void> {
const response = await fetch(ENDPOINTS.SNAPSHOTS, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(snapshot)
});
await parseJsonOrThrow(response);
}

export async function getSnapshots(): Promise<Snapshot[]> {
const response = await fetch(ENDPOINTS.SNAPSHOTS, { method: 'GET' });
const data = await parseJsonOrThrow(response);
return Array.isArray(data) ? (data as Snapshot[]) : [];
}

export async function clearSnapshots(): Promise<void> {
const response = await fetch(ENDPOINTS.SNAPSHOTS, { method: 'DELETE' });
await parseJsonOrThrow(response);
}

export async function finalizeBuild(
token: string
): Promise<FinalizeBuildResponse> {
const response = await fetch(ENDPOINTS.FINALIZE_BUILD, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token,
  }),
});

const data = await parseJsonOrThrow(response);
return data as FinalizeBuildResponse;
}