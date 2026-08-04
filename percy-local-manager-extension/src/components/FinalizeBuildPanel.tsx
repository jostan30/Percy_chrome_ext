import { useFinalizeBuild } from '../hooks/useFinalizeBuild';

interface FinalizeBuildPanelProps {
  token: string;
  disabled: boolean;
  onFinalized: () => void;
}

export function FinalizeBuildPanel({
  token,
  disabled,
  onFinalized,
}: FinalizeBuildPanelProps) {
  const { status, error, result, finalize } = useFinalizeBuild(onFinalized);

  const isFinalizing = status === 'loading';

  function handleOpenBuild() {
    if (result?.buildUrl) {
      chrome.tabs.create({ url: result.buildUrl });
    }
  }

  return (
    <div className="finalize-build">
      <button
        className="button button--primary"
        onClick={() => finalize(token)}
        disabled={disabled || isFinalizing || token.trim() === ''}
      >
        {isFinalizing ? 'Finalizing Build…' : 'Finalize Build'}
      </button>

      {status === 'success' && result && (
        <div className="finalize-result">
          <p className="message message--success">✓ Build finished</p>

          <button className="button button--link" onClick={handleOpenBuild}>
            Open Percy Build →
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="message message--error">{error}</p>
      )}
    </div>
  );
}