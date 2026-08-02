package snapshot

type MemoryStore struct {
	snapshots []Snapshot
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		snapshots: []Snapshot{},
	}
}

func (m *MemoryStore) Add(snapshot Snapshot) {
	m.snapshots =append(m.snapshots ,snapshot)
}

func (m *MemoryStore) All() []Snapshot {
	return m.snapshots
}

func (m *MemoryStore) Clear() {
	m.snapshots = []Snapshot{}
}

func (m *MemoryStore) Count() int {
	return len(m.snapshots)
}