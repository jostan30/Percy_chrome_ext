import { useEffect, useState } from 'react';
import type { LibrarySnapshotReference } from '../types';

export function SnapshotDetail() {
  const [snapshot, setSnapshot] = useState<LibrarySnapshotReference | null>(null);

  useEffect(() => {
    chrome.storage.local.get('library:selectedSnapshot', (result) => {
      setSnapshot(result['library:selectedSnapshot'] ?? null);
      // clear it so a stale value doesn't leak into a future page open
      chrome.storage.local.remove('library:selectedSnapshot');
    });
  }, []);

  if (!snapshot) {
    return <main className="detail-page detail-page--empty">No snapshot selected.</main>;
  }

  return (
    <main className="detail-page">
      <h1 className="detail-page__title">{snapshot.name}</h1>
      {snapshot.testCaseName && (
        <p className="detail-page__subtitle">{snapshot.testCaseName}</p>
      )}
      {snapshot.previewUrl ? (
        <img className="detail-page__image" src={snapshot.previewUrl} alt={snapshot.name} />
      ) : (
        <p className="field-label">No preview available for this snapshot.</p>
      )}
    </main>
  );
}