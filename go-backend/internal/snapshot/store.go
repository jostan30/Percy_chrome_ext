package snapshot

type Store interface {
	Add(snapshot Snapshot)
	All() []Snapshot
	Delete(id string) bool
	Clear()
	Count() int
}