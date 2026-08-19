import { useState } from 'react';
import type { Snapshot } from '../types';
import { updateSnapshot } from '../services/backendApi';

interface EditSnapshotPanelProps {
  snapshot: Snapshot;
  onClose: () => void;
  onSaved: (snapshot: Snapshot) => void;
}

export function EditSnapshotPanel({
  snapshot,
  onClose,
  onSaved,
}: EditSnapshotPanelProps) {
  const [name, setName] = useState(snapshot.name);
  const [widths, setWidths] = useState(snapshot.widths.join(', '));
  const [minHeight, setMinHeight] = useState(String(snapshot.minHeight));
  const [scope, setScope] = useState(snapshot.scope ?? '');
  const [percyCSS, setPercyCSS] = useState(snapshot.percyCSS ?? '');
  const [enableJavaScript, setEnableJavaScript] = useState(
    snapshot.enableJavaScript
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!snapshot.id) {
      setError('Snapshot ID is missing.');
      return;
    }

    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Snapshot name is required.');
      return;
    }

    const parsedWidths = widths
      .split(',')
      .map((width) => Number(width.trim()))
      .filter((width) => Number.isFinite(width) && width > 0);

    if (parsedWidths.length === 0) {
      setError('At least one valid width is required.');
      return;
    }

    const parsedMinHeight = Number(minHeight);

    if (!Number.isFinite(parsedMinHeight) || parsedMinHeight < 0) {
      setError('Minimum height must be a valid number.');
      return;
    }

    setSaving(true);

    try {
      const updatedSnapshot = await updateSnapshot(snapshot.id, {
        name: trimmedName,
        widths: parsedWidths,
        minHeight: parsedMinHeight,
        scope: scope.trim() || undefined,
        percyCSS: percyCSS.trim() || undefined,
        enableJavaScript,
      });

      onSaved(updatedSnapshot);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update snapshot.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="snapshot-edit-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="snapshot-edit-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-snapshot-title"
      >
        {/* Header */}

        <div className="snapshot-edit-panel__header">
          <div>
            <span className="snapshot-edit-panel__eyebrow">
              Snapshot
            </span>

            <h2 id="edit-snapshot-title">
              Edit Snapshot
            </h2>

            <p>
              Update the Percy options for this snapshot.
            </p>
          </div>

          <button
            type="button"
            className="snapshot-edit-panel__close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Name */}

        <div className="snapshot-edit-field">
          <label htmlFor="edit-snapshot-name">
            Name
          </label>

          <input
            id="edit-snapshot-name"
            className="input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
          />
        </div>

        {/* Widths */}

        <div className="snapshot-edit-field">
          <label htmlFor="edit-snapshot-widths">
            Widths
          </label>

          <input
            id="edit-snapshot-widths"
            className="input"
            type="text"
            value={widths}
            onChange={(event) => setWidths(event.target.value)}
            placeholder="375, 768, 1280"
            disabled={saving}
          />

          <span className="snapshot-edit-help">
            Comma-separated widths in pixels.
          </span>
        </div>

        {/* Minimum height */}

        <div className="snapshot-edit-field">
          <label htmlFor="edit-snapshot-height">
            Minimum Height
          </label>

          <input
            id="edit-snapshot-height"
            className="input"
            type="number"
            min="0"
            value={minHeight}
            onChange={(event) => setMinHeight(event.target.value)}
            disabled={saving}
          />

          <span className="snapshot-edit-help">
            Minimum height in pixels.
          </span>
        </div>

        {/* Scope */}

        <div className="snapshot-edit-field">
          <label htmlFor="edit-snapshot-scope">
            Scope
          </label>

          <input
            id="edit-snapshot-scope"
            className="input"
            type="text"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            placeholder=".main-content"
            disabled={saving}
          />

          <span className="snapshot-edit-help">
            Optional CSS selector to capture only a specific element.
          </span>
        </div>

        {/* Percy CSS */}

        <div className="snapshot-edit-field">
          <label htmlFor="edit-snapshot-css">
            Percy CSS
          </label>

          <textarea
            id="edit-snapshot-css"
            className="input snapshot-edit-panel__textarea"
            value={percyCSS}
            onChange={(event) => setPercyCSS(event.target.value)}
            placeholder={`body {
  background: white;
}`}
            rows={6}
            disabled={saving}
          />

          <span className="snapshot-edit-help">
            CSS applied specifically to this Percy snapshot.
          </span>
        </div>

        {/* JavaScript */}

        <label className="snapshot-edit-toggle">
          <div className="snapshot-edit-toggle__content">
            <span className="snapshot-edit-toggle__title">
              Enable JavaScript
            </span>

            <span className="snapshot-edit-toggle__description">
              Allow JavaScript to run when Percy renders this snapshot.
            </span>
          </div>

          <input
            type="checkbox"
            checked={enableJavaScript}
            onChange={(event) =>
              setEnableJavaScript(event.target.checked)
            }
            disabled={saving}
          />

          <span className="snapshot-edit-toggle__switch" />
        </label>

        {/* Error */}

        {error && (
          <p className="message message--error">
            {error}
          </p>
        )}

        {/* Actions */}

        <div className="snapshot-edit-panel__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="button button--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}