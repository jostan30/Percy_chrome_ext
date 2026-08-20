import { useMemo, useState } from 'react';
import type {
  LibrarySnapshotReference,
} from '../types';

interface SnapshotDetailModalProps {
  snapshot: LibrarySnapshotReference;
  onClose: () => void;
}

export function SnapshotDetailModal({
  snapshot,
  onClose,
}: SnapshotDetailModalProps) {
  const comparisons = snapshot.comparisons ?? [];

  const widths = useMemo(() => {
    return Array.from(
      new Set(
        comparisons.map(
          (comparison) => comparison.width
        )
      )
    ).sort((a, b) => a - b);
  }, [comparisons]);

  const [selectedWidth, setSelectedWidth] =
    useState<number | null>(
      widths.length > 0 ? widths[0] : null
    );

  const comparisonsForWidth =
    selectedWidth === null
      ? []
      : comparisons.filter(
          (comparison) =>
            comparison.width === selectedWidth
        );

  const [comparisonIndex, setComparisonIndex] =
    useState(0);

  const selectedComparison =
    comparisonsForWidth[comparisonIndex] ??
    comparisonsForWidth[0];

  function selectWidth(width: number) {
    setSelectedWidth(width);
    setComparisonIndex(0);
  }

  function previousComparison() {
    if (comparisonsForWidth.length <= 1) {
      return;
    }

    setComparisonIndex((current) =>
      current === 0
        ? comparisonsForWidth.length - 1
        : current - 1
    );
  }

  function nextComparison() {
    if (comparisonsForWidth.length <= 1) {
      return;
    }

    setComparisonIndex((current) =>
      current === comparisonsForWidth.length - 1
        ? 0
        : current + 1
    );
  }

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
        <header className="snapshot-modal__header">
          <div>
            <h2
              id="snapshot-modal-title"
              className="snapshot-modal__title"
            >
              {snapshot.name}
            </h2>

            <p className="snapshot-modal__build">
              Build {snapshot.buildId}
            </p>
          </div>

          <button
            type="button"
            className="snapshot-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="snapshot-modal__details">
          <div className="snapshot-modal__detail">
            <span className="snapshot-modal__detail-label">
              JavaScript
            </span>

            <span className="snapshot-modal__detail-value">
              {snapshot.enableJavaScript
                ? 'Enabled'
                : 'Disabled'}
            </span>
          </div>

          <div className="snapshot-modal__detail">
            <span className="snapshot-modal__detail-label">
              Comparisons
            </span>

            <span className="snapshot-modal__detail-value">
              {comparisons.length}
            </span>
          </div>
        </div>

        {widths.length > 0 && (
          <div className="snapshot-modal__width-section">
            <span className="snapshot-modal__section-label">
              Width
            </span>

            <div className="snapshot-modal__widths">
              {widths.map((width) => (
                <button
                  key={width}
                  type="button"
                  className={`snapshot-modal__width ${
                    selectedWidth === width
                      ? 'snapshot-modal__width--active'
                      : ''
                  }`}
                  onClick={() =>
                    selectWidth(width)
                  }
                >
                  {width}px
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedComparison ? (
          <div className="snapshot-modal__preview-section">
            <div className="snapshot-modal__comparison-info">
              <div>
                <strong>
                  {selectedComparison.width}px
                </strong>

                <span>
                  {' '}
                  × {selectedComparison.height}px
                </span>
              </div>

              {comparisonsForWidth.length > 1 && (
                <span>
                  {comparisonIndex + 1} /{' '}
                  {comparisonsForWidth.length}
                </span>
              )}
            </div>

            <div className="snapshot-modal__image-container">
              {selectedComparison.previewUrl ? (
                <img
                  className="snapshot-modal__image"
                  src={selectedComparison.previewUrl}
                  alt={`${snapshot.name} ${selectedComparison.width}px`}
                />
              ) : (
                <div className="snapshot-modal__no-image">
                  No screenshot available.
                </div>
              )}
            </div>

            {comparisonsForWidth.length > 1 && (
              <div className="snapshot-modal__navigation">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={previousComparison}
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  className="button button--secondary"
                  onClick={nextComparison}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="snapshot-modal__empty">
            No comparison data available.
          </div>
        )}
      </div>
    </div>
  );
}