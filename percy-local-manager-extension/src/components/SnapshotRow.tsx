import type { Snapshot } from '../types';

interface SnapshotRowProps {
  snapshot: Snapshot;
  onDelete?: (id: string) => void;
  onEdit?: (snapshot: Snapshot) => void;
  deleting?: boolean;
}

export function SnapshotRow({
  snapshot,
  onDelete,
  onEdit,
  deleting = false,
}: SnapshotRowProps) {
  const widths = snapshot.widths.length > 0
    ? snapshot.widths.join(', ')
    : 'Default';

  const hasOptions =
    Boolean(snapshot.scope) ||
    Boolean(snapshot.percyCSS) ||
    snapshot.enableJavaScript;

  return (
    <tr className="snapshot-row">
      {/* Name */}
      <td className="snapshot-row__name">
        <div className="snapshot-row__name-content">
          <span>{snapshot.name}</span>

          {snapshot.enableJavaScript && (
            <span className="snapshot-row__badge snapshot-row__badge--js">
              JS
            </span>
          )}
        </div>
      </td>

      {/* URL */}
      <td
        className="snapshot-row__url"
        title={snapshot.url}
      >
        {snapshot.url}
      </td>

      {/* Widths */}
      <td className="snapshot-row__widths">
        {widths}
      </td>

      {/* Minimum height */}
      <td className="snapshot-row__height">
        {snapshot.minHeight}px
      </td>

      {/* Options */}
      <td className="snapshot-row__options">
        {hasOptions ? (
          <div className="snapshot-row__options-list">
            {snapshot.scope && (
              <span
                className="snapshot-row__option"
                title={`Scope: ${snapshot.scope}`}
              >
                Scope
              </span>
            )}

            {snapshot.percyCSS && (
              <span
                className="snapshot-row__option"
                title="Custom Percy CSS"
              >
                CSS
              </span>
            )}

            {snapshot.enableJavaScript && (
              <span className="snapshot-row__option">
                JavaScript
              </span>
            )}
          </div>
        ) : (
          <span className="snapshot-row__no-options">
            —
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="snapshot-row__actions">
        {onEdit && (
          <button
            type="button"
            className="snapshot-row__edit"
            onClick={() => onEdit(snapshot)}
            disabled={deleting}
          >
            Edit
          </button>
        )}

        {onDelete && snapshot.id && (
          <button
            type="button"
            className="snapshot-row__delete"
            onClick={() => onDelete(snapshot.id!)}
            disabled={deleting}
            title="Delete snapshot"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </td>
    </tr>
  );
}