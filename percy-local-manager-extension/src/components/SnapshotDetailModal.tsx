import type { LibrarySnapshotReference } from '../types';

interface SnapshotDetailModalProps {
  snapshot: LibrarySnapshotReference;
  onClose: () => void;
}

export function SnapshotDetailModal({
  snapshot,
  onClose,
}: SnapshotDetailModalProps) {
  return (
    <div
      className="snapshot-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="snapshot-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="snapshot-modal__content">
        <div className="snapshot-modal__header">
          <div>
            <h2 id="snapshot-modal-title">
              {snapshot.name}
            </h2>

            {snapshot.testCaseName && (
              <p>
                {snapshot.testCaseName}
              </p>
            )}
          </div>

          <button
            type="button"
            className="snapshot-modal__close"
            onClick={onClose}
            aria-label="Close snapshot"
          >
            ×
          </button>
        </div>

        <div className="snapshot-modal__body">
          {snapshot.previewUrl ? (
            <img
              className="snapshot-modal__image"
              src={snapshot.previewUrl}
              alt={snapshot.name}
            />
          ) : (
            <div className="snapshot-modal__empty">
              No preview available for this snapshot.
            </div>
          )}

          <div className="snapshot-modal__meta">
            <div>
              <span>Name</span>
              <strong>{snapshot.name}</strong>
            </div>

            {snapshot.testCaseName && (
              <div>
                <span>Test Case</span>
                <strong>
                  {snapshot.testCaseName}
                </strong>
              </div>
            )}

            {snapshot.buildId && (
              <div>
                <span>Build ID</span>
                <strong>{snapshot.buildId}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}