import type { Snapshot } from '../types';

interface SnapshotCardProps {
  snapshot: Snapshot;
}

export function SnapshotCard({ snapshot }: SnapshotCardProps) {
  return (
    <div className="snapshot-card">
      <h3>{snapshot.name}</h3>

      <strong>URL</strong>
      <p>{snapshot.url}</p>

      <strong>Viewport</strong>
      <p>
        {snapshot.viewportWidth} × {snapshot.viewportHeight}
      </p>
    </div>
  );
}