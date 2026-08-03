package service

import (
	"time"

	"github.com/google/uuid"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
)

type SnapshotService struct {
	store snapshot.Store
}

func NewSnapshotService(store snapshot.Store) *SnapshotService {
	return &SnapshotService{
		store: store,
	}
}

func (s *SnapshotService) Create(snapshot snapshot.Snapshot) (snapshot.Snapshot ,error) {

	snapshot.ID = uuid.NewString()
	snapshot.CreatedAt = time.Now().UTC()

	s.store.Add(snapshot)

	return snapshot ,nil
}

func (s *SnapshotService) List() []snapshot.Snapshot {
	return s.store.All()
}

func (s *SnapshotService) Clear() {
	s.store.Clear()
}