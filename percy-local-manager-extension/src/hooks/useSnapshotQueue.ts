import { useCallback, useEffect, useState } from 'react';
import { getSnapshots } from '../services/backendApi';

interface UseSnapshotQueueResult {
  count: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Tracks how many snapshots are currently queued on the backend.
 * Call `refresh()` after a successful capture or finalize to resync.
 */
export function useSnapshotQueue(): UseSnapshotQueueResult {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshots = await getSnapshots();
      setCount(snapshots.length);
    } catch {
      // Leave the last known count in place if the backend is unreachable.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { count, isLoading, refresh };
}
