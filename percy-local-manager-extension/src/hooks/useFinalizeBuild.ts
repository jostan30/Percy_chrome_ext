import { useCallback, useState } from 'react';
import { finalizeBuild } from '../services/backendApi';
import type { AsyncStatus, FinalizeBuildResponse } from '../types';

interface UseFinalizeBuildResult {
  status: AsyncStatus;
  error: string | null;
  result: FinalizeBuildResponse | null;
  finalize: (token: string) => Promise<void>;
  reset: () => void;
}

/**
 * Triggers POST /build/finalize.
 */
export function useFinalizeBuild(
  onFinalized?: () => void
): UseFinalizeBuildResult {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinalizeBuildResponse | null>(null);

  const finalize = useCallback(
    async (token: string) => {
      setStatus('loading');
      setError(null);

      try {
        const response = await finalizeBuild(token);
        setResult(response);
        setStatus('success');
        onFinalized?.();
      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error ? err.message : 'Failed to finalize build.'
        );
      }
    },
    [onFinalized]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setResult(null);
  }, []);

  return { status, error, result, finalize, reset };
}