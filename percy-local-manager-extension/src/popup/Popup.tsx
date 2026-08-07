import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useSnapshotQueue } from '../hooks/useSnapshotQueue';
import { useLibraryToken } from '../hooks/useLibraryToken';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { QueueCount } from '../components/QueueCount';
import { CaptureSnapshotPanel } from '../components/CaptureSnapshotPanel';
import { LibraryTokenPanel } from '../components/LibraryTokenPanel';
import { BrandMark } from '../components/BrandMark';

export function Popup() {
  const connectionStatus = useConnectionStatus();
  const queue = useSnapshotQueue();
  const { status: libraryStatus } = useLibraryToken();

  const isBackendOffline = connectionStatus === 'offline';
  const isLibraryConnected = libraryStatus === 'success';

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

        {!isLibraryConnected && <LibraryTokenPanel />}

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