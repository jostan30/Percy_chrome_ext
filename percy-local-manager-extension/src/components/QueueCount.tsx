interface QueueCountProps {
  count: number;
  isLoading: boolean;
}

export function QueueCount({ count, isLoading }: QueueCountProps) {
  return (
    <div className="queue-count">
      <span className="queue-count__label">Queued Snapshots</span>
      <span className="queue-count__value">{isLoading ? '—' : count}</span>
    </div>
  );
}