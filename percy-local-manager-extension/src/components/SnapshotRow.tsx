import type { Snapshot } from '../types';

interface SnapshotRowProps {
  snapshot: Snapshot;
}

export function SnapshotRow({ snapshot }: SnapshotRowProps) {
  return (
    <tr className="snapshot-row">
      <td className="snapshot-row__name">{snapshot.name}</td>
      <td className="snapshot-row__url" title={snapshot.url}>{snapshot.url}</td>
      <td className="snapshot-row__viewport">
        {snapshot.viewportWidth} × {snapshot.viewportHeight}
      </td>
    </tr>
  );
}