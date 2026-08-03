import type { ConnectionStatus as ConnectionStatusType } from '../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

const LABELS: Record<ConnectionStatusType, string> = {
  checking: 'Checking connection…',
  connected: 'Backend Connected',
  offline: 'Backend Offline'
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  return (
    <div className={`connection-status connection-status--${status}`}>
      <span className="connection-status__dot" aria-hidden="true" />
      <span>{LABELS[status]}</span>
    </div>
  );
}
