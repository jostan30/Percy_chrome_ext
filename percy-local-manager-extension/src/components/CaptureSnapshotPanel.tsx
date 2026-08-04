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
      <span className="panel__eyebrow">Capture</span>

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
        className="button button--primary button--block"
        onClick={handleCapture}
        disabled={disabled || isCapturing}
      >
        {isCapturing ? (
          'Capturing…'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.8 3.5h4.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Capture Snapshot
          </>
        )}
      </button>

      {status === 'success' && <p className="message message--success">✓ Snapshot saved</p>}
      {status === 'error' && <p className="message message--error">{error}</p>}
    </div>
  );
}