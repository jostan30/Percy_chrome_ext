package snapshot

type Store interface {
	Add(snapshot Snapshot)
	All() []Snapshot
	Clear()
	Count() int
}