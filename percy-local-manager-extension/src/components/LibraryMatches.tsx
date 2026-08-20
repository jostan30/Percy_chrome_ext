import type { LibrarySnapshotReference } from '../types';

interface LibraryMatchesProps {
  results: LibrarySnapshotReference[];
  isSearching: boolean;
}

function openSnapshotInLibrary(
  snapshot: LibrarySnapshotReference
) {
  const params = new URLSearchParams();

  params.set('search', snapshot.name);
  params.set('snapshotId', snapshot.id);

  chrome.tabs.create({
    url: chrome.runtime.getURL(
      `library.html?${params.toString()}`
    ),
  });
}

export function LibraryMatches({
  results,
  isSearching,
}: LibraryMatchesProps) {
  if (isSearching) {
    return (
      <p className="field-label">
        Searching library...
      </p>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="library-matches">
      <span className="field-label">
        Existing snapshot
        {results.length > 1 ? 's' : ''} found
      </span>

      {results.map((snapshot) => {
        const firstComparison =
          snapshot.comparisons[0];

        return (
          <button
            key={`${snapshot.buildId}-${snapshot.id}`}
            className="library-match"
            type="button"
            onClick={() =>
              openSnapshotInLibrary(snapshot)
            }
          >
            {firstComparison?.previewUrl ? (
              <img
                className="library-match__preview"
                src={firstComparison.previewUrl}
                alt={snapshot.name}
              />
            ) : (
              <div className="library-match__preview library-match__preview--empty" />
            )}

            <div className="library-match__meta">
              <span className="library-match__name">
                {snapshot.name}
              </span>

              <span className="library-match__test">
                {snapshot.comparisons.length}{' '}
                comparison
                {snapshot.comparisons.length === 1
                  ? ''
                  : 's'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}