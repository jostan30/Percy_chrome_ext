import { clearSnapshots } from '../services/backendApi';

interface ClearSnapshotsButtonProps {
  disabled: boolean;
  onCleared: () => void;
}

export function ClearSnapshotsButton({
  disabled,
  onCleared,
}: ClearSnapshotsButtonProps) {
  async function handleClear() {
    try {
      await clearSnapshots();
      onCleared();
    } catch (err) {
      console.error(err);
      alert('Failed to clear snapshots');
    }
  }

  return (
    <button
      className="button button--danger"
      onClick={handleClear}
      disabled={disabled}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0 1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      Clear Snapshots
    </button>
  );
}