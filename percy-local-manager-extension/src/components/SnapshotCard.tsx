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

      <strong>Widths</strong>
      <p>
        {snapshot.widths.length > 0
          ? snapshot.widths.join(' × ')
          : 'Default'}
      </p>

      <strong>Minimum Height</strong>
      <p>{snapshot.minHeight}px</p>

      {snapshot.scope && (
        <>
          <strong>Scope</strong>
          <p>{snapshot.scope}</p>
        </>
      )}

      {snapshot.percyCSS && (
        <>
          <strong>Percy CSS</strong>
          <p className="snapshot-card__css">
            {snapshot.percyCSS}
          </p>
        </>
      )}

      <strong>JavaScript</strong>
      <p>
        {snapshot.enableJavaScript ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  );
}