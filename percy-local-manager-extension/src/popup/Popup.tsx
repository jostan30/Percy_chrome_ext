import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useSnapshotQueue } from '../hooks/useSnapshotQueue';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { QueueCount } from '../components/QueueCount';
import { CaptureSnapshotPanel } from '../components/CaptureSnapshotPanel';
import { BrandMark } from '../components/BrandMark';

/**
 * The extension's only job: capture browser state and hand it to the local
 * Go backend. No Percy CLI, tokens, or build logic ever live here.
 */
export function Popup() {
  const connectionStatus = useConnectionStatus();
  const queue = useSnapshotQueue();

  const isBackendOffline = connectionStatus === 'offline';

  return (
    <main className="popup">
      <header className="popup__header">
        <div className="popup__brand">
          <BrandMark />
          <div className="popup__brand-text">
            <span className="popup__title">Percy</span>
            <span className="popup__subtitle">Local Manager</span>
          </div>
        </div>
        <ConnectionStatus status={connectionStatus} />
      </header>
      <div className="popup__accent-strip" aria-hidden="true" />

      <div className="popup__body">
        <QueueCount count={queue.count} isLoading={queue.isLoading} />

        <CaptureSnapshotPanel disabled={isBackendOffline} onCaptured={queue.refresh} />

        <button
          className="button button--secondary button--block"
          onClick={() =>
            chrome.tabs.create({
              url: chrome.runtime.getURL('snapshots.html'),
            })
          }
          disabled={isBackendOffline}
        >
          View Snapshots
        </button>
      </div>
    </main>
  );
}