import { useState } from 'react';
import { setLibraryToken } from '../services/backendApi';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useLibraryToken() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function saveToken(token: string) {
    setStatus('loading');
    setError(null);
    try {
      await setLibraryToken(token);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save token');
    }
  }

  return { status, error, saveToken };
}