package library

import (
	"log"
	"strings"
	"sync"
)

// Service refreshes the cache from Percy and serves searches against it.
// It never touches Percy's JSON:API shapes directly — that's entirely
// client.go's job.
type Service struct {
	mu     sync.Mutex // guards client, since SetToken may be called again
	client *Client
	cache  *Cache
}

func NewService() *Service {
	return &Service{
		cache: NewCache(),
	}
}

// SetToken stores the Percy read token in memory and immediately rebuilds
// the cache from it. Calling this again replaces both the token and the
// cache — that's the only time a rebuild happens.
func (s *Service) SetToken(token string) error {
	client := NewClient(token)

	s.mu.Lock()
	s.client = client
	s.mu.Unlock()

	library, err := client.LoadLibrary()
	if err != nil {
		log.Printf("[library] SetToken failed: %v", err)
		return err
	}

	s.cache.Set(library)
	log.Printf("[library] cache updated: %d snapshots ready to search", len(library))
	return nil
}

// Search returns every cached snapshot whose name contains query,
// case-insensitively. No fuzzy matching.
func (s *Service) Search(query string) []SnapshotReference {
	needle := strings.ToLower(query)

	all := s.cache.All()
	results := make([]SnapshotReference, 0, len(all))

	for _, ref := range all {
		if strings.Contains(strings.ToLower(ref.Name), needle) {
			results = append(results, ref)
		}
	}

	return results
}