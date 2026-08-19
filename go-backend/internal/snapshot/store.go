package snapshot

type Store interface {
	Add(snapshot Snapshot)
	All() []Snapshot
	Delete(id string) bool
	GetByID(id string) (Snapshot, bool)
	Update(snapshot Snapshot) bool
	Clear()
	Count() int
}