import { useEffect, useState } from 'react';
import { setLibraryToken, getLibraryStatus } from '../services/backendApi';

type SaveStatus = 'idle' | 'loading' | 'success' | 'error';

export function useLibraryToken() {
  const [isConnected, setIsConnected] = useState(false);
  const [count, setCount] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLibraryStatus()
      .then((status) => {
        if (cancelled) return;
        setIsConnected(status.connected);
        setCount(status.count);
      })
      .catch(() => {
        // backend offline or unreachable — leave isConnected false, the
        // ConnectionStatus indicator already surfaces this elsewhere
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveToken(token: string) {
    setSaveStatus('loading');
    setError(null);
    try {
      await setLibraryToken(token);
      const status = await getLibraryStatus();
      setIsConnected(status.connected);
      setCount(status.count);
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save token');
    }
  }

  return { isConnected, count, isChecking, saveStatus, error, saveToken };
}