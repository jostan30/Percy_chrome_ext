import type { LibrarySnapshotReference } from '../types';

interface LibraryMatchesProps {
  results: LibrarySnapshotReference[];
  isSearching: boolean;
}

export function LibraryMatches({ results, isSearching }: LibraryMatchesProps) {
  if (isSearching) return <p className="field-label">Searching library...</p>;
  if (results.length === 0) return null;

  return (
    <div className="library-matches">
      <span className="field-label">
        Existing snapshot{results.length > 1 ? 's' : ''} found — for reference
      </span>
      {results.map((ref) => (
        <div className="library-match" key={`${ref.buildId ?? ''}-${ref.name}`}>
          {ref.previewUrl && (
            <img className="library-match__preview" src={ref.previewUrl} alt={ref.name} />
          )}
          <div className="library-match__meta">
            <span className="library-match__name">{ref.name}</span>
            {ref.testCaseName && <span className="library-match__test">{ref.testCaseName}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}