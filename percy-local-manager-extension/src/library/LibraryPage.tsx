import { useEffect, useMemo, useState } from 'react';
import { getAllLibrarySnapshots } from '../services/backendApi';
import type { LibrarySnapshotReference } from '../types';

function openSnapshotDetail(ref: LibrarySnapshotReference) {
  chrome.storage.local.set({ 'library:selectedSnapshot': ref }, () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('library-snapshot.html') });
  });
}

export function LibraryPage() {
  const [all, setAll] = useState<LibrarySnapshotReference[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getAllLibrarySnapshots()
      .then(setAll)
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Failed to load library'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === '') return all;
    return all.filter((ref) => ref.name.toLowerCase().includes(needle));
  }, [all, query]);

  return (
    <main className="library-page">
      <h1 className="library-page__title">Snapshot Library</h1>

      <input
        className="text-input library-page__search"
        type="text"
        placeholder="Search snapshots..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && <p className="field-label">Loading library...</p>}
      {loadError && <p className="message message--error">{loadError}</p>}

      {!isLoading && !loadError && (
        <>
          <p className="field-label">
            {filtered.length} of {all.length} snapshot{all.length === 1 ? '' : 's'}
          </p>
          <div className="library-grid">
            {filtered.map((ref) => (
              <button
                className="library-grid__item"
                key={`${ref.buildId ?? ''}-${ref.name}`}
                onClick={() => openSnapshotDetail(ref)}
                type="button"
              >
                {ref.previewUrl ? (
                  <img className="library-grid__preview" src={ref.previewUrl} alt={ref.name} />
                ) : (
                  <div className="library-grid__preview library-grid__preview--empty" />
                )}
                <span className="library-grid__name">{ref.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}