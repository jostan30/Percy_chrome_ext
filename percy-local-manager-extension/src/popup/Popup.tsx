import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useSnapshotQueue } from '../hooks/useSnapshotQueue';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { QueueCount } from '../components/QueueCount';
import { CaptureSnapshotPanel } from '../components/CaptureSnapshotPanel';

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
        <h1>Percy Local Manager</h1>
        <ConnectionStatus status={connectionStatus} />
      </header>

      <QueueCount count={queue.count} isLoading={queue.isLoading} />

      <CaptureSnapshotPanel disabled={isBackendOffline} onCaptured={queue.refresh} />

     <button
        className="button button--secondary"
        onClick={() =>
          chrome.tabs.create({
            url: chrome.runtime.getURL('snapshots.html'),
          })
        }
        disabled={isBackendOffline}
      >
        View Snapshots
      </button>
    </main>
  );
}
