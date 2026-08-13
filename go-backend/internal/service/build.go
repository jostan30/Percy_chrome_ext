package service

import (
	"fmt"
	"log"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/percy"
)

type BuildService struct {
	percy    *percy.Controller
	client   *percy.Client
	snapshot *SnapshotService
}
type BuildResult struct {
    BuildID  string
    BuildURL string
}

func NewBuildService(controller *percy.Controller,client *percy.Client,snapshot*SnapshotService, ) *BuildService {
	return &BuildService{
		percy: controller,
		client: client,
		snapshot: snapshot,
	}
}

func (s *BuildService) Finalize(token string) (*BuildResult, error) {

	snapshots := s.snapshot.List()

	if len(snapshots) == 0 {
		return nil, fmt.Errorf("no snapshots available")
	}

	if err := s.percy.EnsureReady(); err != nil {
		return nil, err
	}

	log.Println("[build] Percy runtime ready")
	log.Println("[build] Starting Percy exec:start...")

	if err := s.percy.Start(token); err != nil {
		return nil, err
	}

	defer s.percy.Stop()

	health, err := s.client.Health()
	if err != nil {
		return nil, err
	}

	fmt.Println(health)

	for i, snap := range snapshots {

		fmt.Printf(
			"Uploading %d/%d: %s\n",
			i+1,
			len(snapshots),
			snap.Name,
		)

		if err := s.client.Snapshot(snap); err != nil {
			return nil, err
		}

		if err := s.percy.WaitFor("Snapshot taken"); err != nil {
			return nil, err
		}

		fmt.Printf(
			"✓ Completed %d/%d\n",
			i+1,
			len(snapshots),
		)
	}

	s.snapshot.Clear()

	fmt.Println("Percy finished processing snapshot")

	return &BuildResult{
		BuildID:  health.Build.ID,
		BuildURL: health.Build.URL,
	}, nil
}