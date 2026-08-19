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

func (m *MemoryStore) GetByID(id string) (Snapshot, bool) {
	for _, snapshot := range m.snapshots {
		if snapshot.ID == id {
			return snapshot, true
		}
	}

	return Snapshot{}, false
}

func (m *MemoryStore) Update(updated Snapshot) bool {
	for i, snapshot := range m.snapshots {
		if snapshot.ID == updated.ID {
			m.snapshots[i] = updated
			return true
		}
	}

	return false
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