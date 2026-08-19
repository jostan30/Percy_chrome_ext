import { useState } from 'react';
import { useCaptureSnapshot } from '../hooks/useCaptureSnapshot';
import { useLibrarySearch } from '../hooks/useLibrarySearch';
import { LibraryMatches } from './LibraryMatches';

interface CaptureSnapshotPanelProps {
  disabled: boolean;
  onCaptured: () => void;
}

export function CaptureSnapshotPanel({
  disabled,
  onCaptured,
}: CaptureSnapshotPanelProps) {
  const [name, setName] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [widths, setWidths] = useState<number[]>([
    375,
    1280,
  ]);

  const [minHeight, setMinHeight] = useState(1024);

  const [enableJavaScript, setEnableJavaScript] = useState(false);

  const [percyCSS, setPercyCSS] = useState('');

  const [scope, setScope] = useState('');

  const { results, isSearching } = useLibrarySearch(name);

  const {
    status,
    error,
    capture,
  } = useCaptureSnapshot(onCaptured);

  const isCapturing = status === 'loading';

  function addWidth() {
    setWidths((current) => [...current, 1280]);
  }

  function updateWidth(index: number, value: string) {
    const width = Number(value);

    setWidths((current) =>
      current.map((item, i) =>
        i === index ? width : item
      )
    );
  }

  function removeWidth(index: number) {
    setWidths((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function handleCapture() {
    await capture(name, {
      widths,
      minHeight,
      enableJavaScript,
      percyCSS,
      scope,
    });
  }

  return (
    <div className="panel">
      <span className="panel__eyebrow">Capture</span>

      <label
        className="field-label"
        htmlFor="snapshot-name"
      >
        Snapshot name (optional)
      </label>

      <input
        id="snapshot-name"
        className="text-input"
        type="text"
        placeholder="Defaults to page title"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        disabled={disabled || isCapturing}
      />

      <LibraryMatches
        results={results}
        isSearching={isSearching}
      />

      <button
        type="button"
        className="advanced-toggle"
        onClick={() =>
          setShowAdvanced((current) => !current)
        }
        disabled={disabled || isCapturing}
      >
        <span>
          {showAdvanced ? '▾' : '▸'}
        </span>

        Advanced snapshot options
      </button>

      {showAdvanced && (
        <div className="advanced-options">
          <div className="advanced-field">
            <label className="field-label">
              Widths
            </label>

            <div className="width-list">
              {widths.map((width, index) => (
                <div
                  className="width-row"
                  key={index}
                >
                  <input
                    className="text-input"
                    type="number"
                    min={1}
                    value={width}
                    onChange={(event) =>
                      updateWidth(
                        index,
                        event.target.value
                      )
                    }
                    disabled={isCapturing}
                  />

                  <button
                    type="button"
                    className="width-remove"
                    onClick={() =>
                      removeWidth(index)
                    }
                    disabled={
                      isCapturing ||
                      widths.length <= 1
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="button button--link"
              onClick={addWidth}
              disabled={isCapturing}
            >
              + Add width
            </button>
          </div>

          <div className="advanced-field">
            <label
              className="field-label"
              htmlFor="snapshot-min-height"
            >
              Minimum height
            </label>

            <input
              id="snapshot-min-height"
              className="text-input"
              type="number"
              min={0}
              value={minHeight}
              onChange={(event) =>
                setMinHeight(
                  Number(event.target.value)
                )
              }
              disabled={isCapturing}
            />
          </div>

          <div className="advanced-field">
            <label
              className="field-label"
              htmlFor="snapshot-scope"
            >
              Scope
            </label>

            <input
              id="snapshot-scope"
              className="text-input"
              type="text"
              placeholder=".main-content"
              value={scope}
              onChange={(event) =>
                setScope(event.target.value)
              }
              disabled={isCapturing}
            />
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={enableJavaScript}
              onChange={(event) =>
                setEnableJavaScript(
                  event.target.checked
                )
              }
              disabled={isCapturing}
            />

            <span>
              Enable JavaScript
            </span>
          </label>

          <div className="advanced-field">
            <label
              className="field-label"
              htmlFor="percy-css"
            >
              Percy CSS
            </label>

            <textarea
              id="percy-css"
              className="text-input textarea-input"
              placeholder=".modal { display: none; }"
              value={percyCSS}
              onChange={(event) =>
                setPercyCSS(event.target.value)
              }
              disabled={isCapturing}
              rows={4}
            />
          </div>
        </div>
      )}

      <button
        className="button button--primary button--block"
        onClick={handleCapture}
        disabled={
          disabled ||
          isCapturing ||
          widths.length === 0 ||
          widths.some((width) => width <= 0)
        }
      >
        {isCapturing ? (
          'Capturing…'
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.8 3.5h4.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />

              <circle
                cx="12"
                cy="12.5"
                r="3.4"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>

            Capture Snapshot
          </>
        )}
      </button>

      {status === 'success' && (
        <p className="message message--success">
          ✓ Snapshot saved
        </p>
      )}

      {status === 'error' && (
        <p className="message message--error">
          {error}
        </p>
      )}
    </div>
  );
}