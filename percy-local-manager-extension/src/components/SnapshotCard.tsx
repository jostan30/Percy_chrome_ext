import type { Snapshot } from '../types';

interface SnapshotCardProps {
  snapshot: Snapshot;
}

export function SnapshotCard({ snapshot }: SnapshotCardProps) {
  return (
    <div className="snapshot-card">
      <h3>{snapshot.name}</h3>

      <p>
        <strong>URL</strong>
      </p>

      <p>{snapshot.url}</p>

      <p>
        <strong>Viewport</strong>
      </p>

      <p>
        {snapshot.viewportWidth} × {snapshot.viewportHeight}
      </p>
    </div>
  );
}