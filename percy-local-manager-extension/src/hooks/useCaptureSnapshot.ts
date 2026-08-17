import { useCallback, useState } from 'react';
import { captureActiveTabState } from '../services/domCapture';
import { createSnapshot } from '../services/backendApi';
import { formatDefaultSnapshotName } from '../utils/formatSnapshotName';
import type { AsyncStatus } from '../types';

interface CaptureOptions {
  enableJavaScript: boolean;
  percyCSS: string;
}

interface UseCaptureSnapshotResult {
  status: AsyncStatus;
  error: string | null;
  capture: (name?: string, options?: CaptureOptions) => Promise<void>;
  reset: () => void;
}

/**
 * Orchestrates a single "Capture Snapshot" action:
 *   1. Read DOM/URL/viewport from the active tab.
 *   2. Attach snapshot-specific Percy options.
 *   3. POST the snapshot to the backend.
 *
 * Contains no Percy logic — the backend decides what to do with the data.
 */
export function useCaptureSnapshot(
  onCaptured?: () => void
): UseCaptureSnapshotResult {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(
    async (
      name?: string,
      options: CaptureOptions = {
        enableJavaScript: false,
        percyCSS: '',
      }
    ) => {
      setStatus('loading');
      setError(null);

      try {
        const pageState = await captureActiveTabState();

        const snapshotName =
          name?.trim() ||
          formatDefaultSnapshotName(
            pageState.title,
            pageState.url
          );

        await createSnapshot({
          name: snapshotName,
          url: pageState.url,
          dom: pageState.dom,
          viewportWidth: pageState.viewportWidth,
          viewportHeight: pageState.viewportHeight,

          enableJavaScript: options.enableJavaScript,
          percyCSS: options.percyCSS.trim(),
        });

        setStatus('success');
        onCaptured?.();
      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to capture snapshot.'
        );
      }
    },
    [onCaptured]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return {
    status,
    error,
    capture,
    reset,
  };
}