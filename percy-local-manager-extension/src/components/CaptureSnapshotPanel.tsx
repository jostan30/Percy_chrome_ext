import { useState } from 'react';
import { useCaptureSnapshot } from '../hooks/useCaptureSnapshot';

interface CaptureSnapshotPanelProps {
  disabled: boolean;
  onCaptured: () => void;
}

export function CaptureSnapshotPanel({ disabled, onCaptured }: CaptureSnapshotPanelProps) {
  const [name, setName] = useState('');
  const { status, error, capture } = useCaptureSnapshot(onCaptured);

  const isCapturing = status === 'loading';

  async function handleCapture() {
    await capture(name);
  }

  return (
    <div className="panel">
      <label className="field-label" htmlFor="snapshot-name">
        Snapshot name (optional)
      </label>
      <input
        id="snapshot-name"
        className="text-input"
        type="text"
        placeholder="Defaults to page title"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={disabled || isCapturing}
      />

      <button
        className="button button--primary"
        onClick={handleCapture}
        disabled={disabled || isCapturing}
      >
        {isCapturing ? 'Capturing…' : 'Capture Snapshot'}
      </button>

      {status === 'success' && <p className="message message--success">✓ Snapshot Saved</p>}
      {status === 'error' && <p className="message message--error">{error}</p>}
    </div>
  );
}
