import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getAllLibrarySnapshots,
} from '../services/backendApi';

import type {
  LibrarySnapshotReference,
} from '../types';

import {
  SnapshotDetailModal,
} from '../components/SnapshotDetailModal';

import { BrandMark } from '../components/BrandMark';

export function LibraryPage() {
  const [all, setAll] =
    useState<LibrarySnapshotReference[]>([]);

  const [query, setQuery] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [selectedSnapshot, setSelectedSnapshot] =
    useState<LibrarySnapshotReference | null>(
      null
    );

  const [
    pendingSnapshotId,
    setPendingSnapshotId,
  ] = useState<string | null>(null);

  /*
   * Read search + snapshot ID from the URL.
   *
   * Example:
   *
   * library.html?search=home&snapshotId=2873098874
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const search = params.get('search');
    const snapshotId =
      params.get('snapshotId');

    if (search) {
      setQuery(search);
    }

    if (snapshotId) {
      window.history.replaceState(
        {},
        '',
        window.location.pathname
      );

      setPendingSnapshotId(snapshotId);
    }
  }, []);

  /*
   * Load library.
   */
  useEffect(() => {
    getAllLibrarySnapshots()
      .then(setAll)
      .catch((err) =>
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Failed to load library'
        )
      )
      .finally(() =>
        setIsLoading(false)
      );
  }, []);

  /*
   * Filter by search query.
   */
  const filtered = useMemo(() => {
    const needle =
      query.trim().toLowerCase();

    if (needle === '') {
      return all;
    }

    return all.filter((snapshot) =>
      snapshot.name
        .toLowerCase()
        .includes(needle)
    );
  }, [all, query]);

  /*
   * Automatically open the snapshot that
   * came from the popup.
   */
  useEffect(() => {
    if (
      !pendingSnapshotId ||
      isLoading ||
      all.length === 0
    ) {
      return;
    }

    const snapshot = all.find(
      (item) =>
        item.id === pendingSnapshotId
    );

    if (snapshot) {
      setSelectedSnapshot(snapshot);
    }

    setPendingSnapshotId(null);
  }, [
    pendingSnapshotId,
    isLoading,
    all,
  ]);

  return (
    <>
      {/* -------------------------------------------------- */}
      {/* Top Bar */}
      {/* -------------------------------------------------- */}

      <div className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand">
            <BrandMark />

            <div className="topbar__brand-text">
              <span className="topbar__title">
                Percy
              </span>

              <span className="topbar__subtitle">
                Local Manager
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="topbar__accent-strip"
        aria-hidden="true"
      />

      {/* -------------------------------------------------- */}
      {/* Library */}
      {/* -------------------------------------------------- */}

      <main className="library-page">
        <div className="library-page__header">
          <div>
            <h1 className="library-page__title">
              Snapshot Library
            </h1>

            <p className="library-page__description">
              Browse snapshots captured in your Percy
              projects.
            </p>
          </div>

          <input
            className="text-input library-page__search"
            type="text"
            placeholder="Search snapshots..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />
        </div>

        <div className="library-page__scroll">
          {isLoading && (
            <p className="field-label">
              Loading library...
            </p>
          )}

          {loadError && (
            <p className="message message--error">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && (
            <>
              <p className="field-label">
                {filtered.length} of {all.length}{' '}
                snapshot
                {all.length === 1 ? '' : 's'}
              </p>

              {filtered.length === 0 ? (
                <div className="library-page__empty">
                  No snapshots found.
                </div>
              ) : (
                <div className="library-grid">
                  {filtered.map((snapshot) => {
                    const firstComparison =
                      snapshot.comparisons[0];

                    return (
                      <button
                        key={`${snapshot.buildId}-${snapshot.id}`}
                        type="button"
                        className="library-grid__item"
                        onClick={() =>
                          setSelectedSnapshot(
                            snapshot
                          )
                        }
                      >
                        {firstComparison?.previewUrl ? (
                          <img
                            className="library-grid__preview"
                            src={
                              firstComparison.previewUrl
                            }
                            alt={snapshot.name}
                          />
                        ) : (
                          <div className="library-grid__preview library-grid__preview--empty" />
                        )}

                        <span className="library-grid__name">
                          {snapshot.name}
                        </span>

                        <span className="library-grid__meta">
                          {snapshot.comparisons.length}{' '}
                          comparison
                          {snapshot.comparisons.length ===
                          1
                            ? ''
                            : 's'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {selectedSnapshot && (
          <SnapshotDetailModal
            snapshot={selectedSnapshot}
            onClose={() =>
              setSelectedSnapshot(null)
            }
          />
        )}
      </main>
    </>
  );
}