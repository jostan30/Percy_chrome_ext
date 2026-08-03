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
      Clear Snapshots
    </button>
  );
}