// The Go backend that owns all Percy CLI interaction.
// The extension only ever talks to this local HTTP server.
export const BACKEND_BASE_URL = 'http://localhost:4321';

export const ENDPOINTS = {
  SNAPSHOTS: `${BACKEND_BASE_URL}/snapshots`,
  FINALIZE_BUILD: `${BACKEND_BASE_URL}/build/finalize`,
  HEALTH: `${BACKEND_BASE_URL}/health`
} as const;

// How often the popup polls /health while it's open.
export const HEALTH_CHECK_INTERVAL_MS = 5000;
