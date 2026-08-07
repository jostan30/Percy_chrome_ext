import { useEffect, useRef, useState } from 'react';
import { searchLibrary } from '../services/backendApi';
import type { LibrarySnapshotReference } from '../types';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export function useLibrarySearch(query: string) {
  const [results, setResults] = useState<LibrarySnapshotReference[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const matches = await searchLibrary(trimmed);
        if (requestId === requestIdRef.current) setResults(matches);
      } catch {
        if (requestId === requestIdRef.current) setResults([]);
      } finally {
        if (requestId === requestIdRef.current) setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isSearching };
}