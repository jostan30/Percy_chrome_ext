import { useEffect, useRef, useState } from 'react';
import { checkHealth } from '../services/backendApi';
import { HEALTH_CHECK_INTERVAL_MS } from '../utils/constants';
import type { ConnectionStatus } from '../types';

/**
 * Polls GET /health on an interval and exposes the current connection status.
 */
export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function poll() {
      const isHealthy = await checkHealth();
      if (isMounted.current) {
        setStatus(isHealthy ? 'connected' : 'offline');
      }
    }

    poll();
    const intervalId = setInterval(poll, HEALTH_CHECK_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  return status;
}
