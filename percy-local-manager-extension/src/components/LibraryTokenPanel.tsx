import { useState } from 'react';
import { useLibraryToken } from '../hooks/useLibraryToken';

export function LibraryTokenPanel() {
  const [token, setToken] = useState('');
  const { status, error, saveToken } = useLibraryToken();
  const isSaving = status === 'loading';

  return (
    <div className="panel">
      <span className="panel__eyebrow">Library Token</span>
      <label className="field-label" htmlFor="library-token">
        Percy read token (for snapshot search)
      </label>
      <input
        id="library-token"
        className="text-input"
        type="password"
        placeholder="Read-only token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        disabled={isSaving}
      />
      <button
        className="button button--secondary button--block"
        onClick={() => saveToken(token)}
        disabled={isSaving || token.trim() === ''}
      >
        {isSaving ? 'Connecting...' : 'Connect Library'}
      </button>
      {status === 'success' && <p className="message message--success">✓ Library ready to search</p>}
      {status === 'error' && <p className="message message--error">{error}</p>}
    </div>
  );
}