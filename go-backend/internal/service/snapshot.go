package service

import (
	"time"
	"errors"
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

func (s *SnapshotService) GetByID(
	id string,
) (snapshot.Snapshot, bool) {
	return s.store.GetByID(id)
}

func (s *SnapshotService) Update(
	id string,
	update func(*snapshot.Snapshot),
) (snapshot.Snapshot, error) {

	snap, exists := s.store.GetByID(id)

	if !exists {
		return snapshot.Snapshot{}, errors.New("snapshot not found")
	}

	update(&snap)

	if !s.store.Update(snap) {
		return snapshot.Snapshot{}, errors.New("failed to update snapshot")
	}

	return snap, nil
}

func (s *SnapshotService) Delete(id string) bool {
	return s.store.Delete(id)
}

func (s *SnapshotService) Clear() {
	s.store.Clear()
}