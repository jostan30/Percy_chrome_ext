package library

import "sync"

// Cache holds the most recently loaded snapshot library in memory. No
// persistence — a process restart clears it, matching the "read token is
// memory-only" requirement.
type Cache struct {
	mu        sync.RWMutex
	snapshots []SnapshotReference
}

func NewCache() *Cache {
	return &Cache{}
}

func (c *Cache) Set(snapshots []SnapshotReference) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.snapshots = snapshots
}

func (c *Cache) All() []SnapshotReference {
	c.mu.RLock()
	defer c.mu.RUnlock()

	out := make([]SnapshotReference, len(c.snapshots))
	copy(out, c.snapshots)

	return out
}

func (c *Cache) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.snapshots = nil
}