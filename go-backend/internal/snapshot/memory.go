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

func (m *MemoryStore) Delete(id string) bool {
	for i, snapshot := range m.snapshots {
		if snapshot.ID == id {
			m.snapshots = append(
				m.snapshots[:i],
				m.snapshots[i+1:]...,
			)

			return true
		}
	}

	return false
}

func (m *MemoryStore) Clear() {
	m.snapshots = []Snapshot{}
}

func (m *MemoryStore) Count() int {
	return len(m.snapshots)
}