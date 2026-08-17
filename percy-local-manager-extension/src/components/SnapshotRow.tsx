import type { Snapshot } from '../types';

interface SnapshotRowProps {
  snapshot: Snapshot;
  onDeleted: () => void;
}

export function SnapshotRow({
  snapshot,
  onDeleted,
}: SnapshotRowProps) {
  return (
    <tr className="snapshot-row">
      <td className="snapshot-row__name">
        {snapshot.name}
      </td>

      <td
        className="snapshot-row__url"
        title={snapshot.url}
      >
        {snapshot.url}
      </td>

      <td className="snapshot-row__viewport">
        {snapshot.viewportWidth} × {snapshot.viewportHeight}
      </td>

      <td className="snapshot-row__actions">
        <button
          type="button"
          onClick={onDeleted}
          className="snapshot-row__delete"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}