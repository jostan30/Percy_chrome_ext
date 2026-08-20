import type { LibrarySnapshotReference } from '../types';

interface LibraryMatchesProps {
  results: LibrarySnapshotReference[];
  isSearching: boolean;
}

function openLibrary(ref: LibrarySnapshotReference) {
  chrome.storage.local.set(
    {
      'library:selectedSnapshot': ref,
      'library:searchQuery': ref.name,
    },
    () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL('library.html'),
      });
    }
  );
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
        Existing snapshot{results.length > 1 ? 's' : ''} found
      </span>

      {results.map((ref) => (
        <button
          key={`${ref.buildId ?? ''}-${ref.name}`}
          type="button"
          className="library-match"
          onClick={() => openLibrary(ref)}
        >
          {ref.previewUrl ? (
            <img
              className="library-match__preview"
              src={ref.previewUrl}
              alt=""
            />
          ) : (
            <div className="library-match__preview library-match__preview--empty" />
          )}

          <div className="library-match__meta">
            <span className="library-match__name">
              {ref.name}
            </span>

            {ref.testCaseName && (
              <span className="library-match__test">
                {ref.testCaseName}
              </span>
            )}
          </div>

          <span className="library-match__arrow">
            →
          </span>
        </button>
      ))}
    </div>
  );
}