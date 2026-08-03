import { useEffect, useState } from 'react';
import { getSnapshots } from '../services/backendApi';
import { SnapshotRow } from '../components/SnapshotRow';
import { FinalizeBuildPanel } from '../components/FinalizeBuildPanel';
import { ClearSnapshotsButton } from '../components/ClearSnapshotsButton';
import type { Snapshot } from '../types';

export function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      const data = await getSnapshots();
      setSnapshots(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="snapshots-page">
      <header className="page-header">
        <h1>Percy Snapshots</h1>
        <p>{snapshots.length} snapshot(s) queued</p>
      </header>

      {loading && <div className="loading-state">Loading…</div>}

      {!loading && snapshots.length === 0 && (
        <div className="empty-state">No snapshots available.</div>
      )}

      {!loading && snapshots.length > 0 && (
        <div className="table-wrap">
          <table className="snapshot-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Viewport</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot, index) => (
                <SnapshotRow key={`${snapshot.name}-${index}`} snapshot={snapshot} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="token-section">
        <label htmlFor="percy-token">Percy Token</label>
        <input
          id="percy-token"
          type="password"
          className="input"
          placeholder="Enter Percy Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <div className="page-actions">
        <ClearSnapshotsButton
          disabled={snapshots.length === 0}
          onCleared={refresh}
        />
        <FinalizeBuildPanel
          token={token}
          disabled={snapshots.length === 0 || token.trim() === ''}
          onFinalized={refresh}
        />
      </div>
    </main>
  );
}