import { useFinalizeBuild } from '../hooks/useFinalizeBuild';

interface FinalizeBuildPanelProps {
  disabled: boolean;
  onFinalized: () => void;
}

export function FinalizeBuildPanel({ disabled, onFinalized }: FinalizeBuildPanelProps) {
  const { status, error, result, finalize } = useFinalizeBuild(onFinalized);

  const isFinalizing = status === 'loading';

  function handleOpenBuild() {
    if (result?.buildUrl) {
      chrome.tabs.create({ url: result.buildUrl });
    }
  }

  return (
    <div className="panel">
      <button
        className="button button--secondary"
        onClick={() => finalize()}
        disabled={disabled || isFinalizing}
      >
        {isFinalizing ? 'Finalizing Build…' : 'Finalize Build'}
      </button>

      {status === 'success' && result && (
        <div className="finalize-result">
          <p className="message message--success">Build Finished</p>
          <button className="button button--link" onClick={handleOpenBuild}>
            Open Percy Build
          </button>
        </div>
      )}

      {status === 'error' && <p className="message message--error">{error}</p>}
    </div>
  );
}
