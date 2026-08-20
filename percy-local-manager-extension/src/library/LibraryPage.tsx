import { useEffect, useMemo, useState } from 'react';
import { getAllLibrarySnapshots } from '../services/backendApi';
import type { LibrarySnapshotReference } from '../types';
import { SnapshotDetailModal } from '../components/SnapshotDetailModal';

const SELECTED_SNAPSHOT_KEY = 'library:selectedSnapshot';
const SEARCH_QUERY_KEY = 'library:searchQuery';

export function LibraryPage() {
  const [all, setAll] = useState<LibrarySnapshotReference[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedSnapshot, setSelectedSnapshot] =
    useState<LibrarySnapshotReference | null>(null);

  const [highlightedSnapshot, setHighlightedSnapshot] =
    useState<string | null>(null);

  /*
   * Read navigation state passed from the popup.
   *
   * The popup stores:
   *   library:searchQuery
   *   library:selectedSnapshot
   */
  useEffect(() => {
    chrome.storage.local.get(
      [SEARCH_QUERY_KEY, SELECTED_SNAPSHOT_KEY],
      (result) => {
        const searchQuery = result[SEARCH_QUERY_KEY];

        const snapshot =
          result[SELECTED_SNAPSHOT_KEY] as
            | LibrarySnapshotReference
            | undefined;

        if (typeof searchQuery === 'string') {
          setQuery(searchQuery);
        }

        if (snapshot) {
          setHighlightedSnapshot(getSnapshotKey(snapshot));
        }

        /*
         * Remove the navigation state after reading it.
         * This prevents stale selection from appearing the next
         * time the Library page is opened normally.
         */
        chrome.storage.local.remove([
          SEARCH_QUERY_KEY,
          SELECTED_SNAPSHOT_KEY,
        ]);
      }
    );
  }, []);

  /*
   * Load the complete Percy snapshot library.
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
      .finally(() => setIsLoading(false));
  }, []);

  /*
   * Filter snapshots based on the search field.
   */
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (needle === '') {
      return all;
    }

    return all.filter((ref) =>
      ref.name.toLowerCase().includes(needle)
    );
  }, [all, query]);

  /*
   * If the popup selected a snapshot, find it once the library
   * has finished loading and automatically open its details.
   */
  useEffect(() => {
    if (
      isLoading ||
      highlightedSnapshot === null ||
      all.length === 0
    ) {
      return;
    }

    const snapshot = all.find(
      (ref) =>
        getSnapshotKey(ref) === highlightedSnapshot
    );

    if (!snapshot) {
      return;
    }

    setSelectedSnapshot(snapshot);

    /*
     * Scroll the selected snapshot into view.
     * A small timeout allows React to render the grid first.
     */
    setTimeout(() => {
      const element = document.querySelector(
        `[data-snapshot-key="${CSS.escape(highlightedSnapshot)}"]`
      );

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);

    setHighlightedSnapshot(null);
  }, [all, isLoading, highlightedSnapshot]);

  function handleSnapshotClick(
    snapshot: LibrarySnapshotReference
  ) {
    setSelectedSnapshot(snapshot);
  }

  return (
    <main className="library-page">
      <div className="library-page__header">
        <h1 className="library-page__title">
          Snapshot Library
        </h1>

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
              snapshot{all.length === 1 ? '' : 's'}
            </p>

            {filtered.length === 0 ? (
              <div className="empty-state">
                No snapshots found.
              </div>
            ) : (
              <div className="library-grid">
                {filtered.map((ref) => {
                  const snapshotKey =
                    getSnapshotKey(ref);

                  return (
                    <button
                      key={snapshotKey}
                      type="button"
                      data-snapshot-key={snapshotKey}
                      className={`library-grid__item ${
                        snapshotKey === highlightedSnapshot
                          ? 'library-grid__item--highlighted'
                          : ''
                      }`}
                      onClick={() =>
                        handleSnapshotClick(ref)
                      }
                    >
                      {ref.previewUrl ? (
                        <img
                          className="library-grid__preview"
                          src={ref.previewUrl}
                          alt={ref.name}
                        />
                      ) : (
                        <div className="library-grid__preview library-grid__preview--empty" />
                      )}

                      <span className="library-grid__name">
                        {ref.name}
                      </span>

                      {ref.testCaseName && (
                        <span className="library-grid__test">
                          {ref.testCaseName}
                        </span>
                      )}
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
  );
}

/**
 * Generates a stable identifier for a library snapshot.
 *
 * buildId + name is preferable to name alone because multiple
 * builds can contain snapshots with the same name.
 */
function getSnapshotKey(
  snapshot: LibrarySnapshotReference
): string {
  return `${snapshot.buildId ?? ''}-${snapshot.name}`;
}