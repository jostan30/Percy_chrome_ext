/**
 * Snapshot payload sent to the Go backend.
 * This mirrors the backend's expected request body for POST /snapshots.
 * The extension never adds Percy-specific fields here.
 */
export interface Snapshot {
  name: string;
  url: string;
  dom: string;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Raw browser state captured from the active tab, before a name is attached.
 */
export interface CapturedPageState {
  url: string;
  dom: string;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Response from POST /build/finalize.
 * The extension treats this as an opaque result of a backend-managed
 * process — it never inspects Percy build internals.
 */
export interface FinalizeBuildResponse {
  buildId: string;
  buildUrl: string;
}

/**
 * Connection status against GET /health.
 */
export type ConnectionStatus = 'checking' | 'connected' | 'offline';

/**
 * Generic async lifecycle status used by capture/finalize hooks.
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
