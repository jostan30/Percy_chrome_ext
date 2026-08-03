package service

import (
	"fmt"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/percy"
)

type BuildService struct {
	percy *percy.Controller
	client *percy.Client
}

func NewBuildService(controller *percy.Controller ,client *percy.Client) *BuildService {
	return &BuildService{
		percy: controller,
		client :client,
	}
}

func (s *BuildService) Finalize(token string) error {
	if err := s.percy.Start(token) ;err != nil {
		return err
	}

	health ,err := s.client.Health()
	if err != nil {
		return err
	}

	fmt.Println(health)

	return nil
}