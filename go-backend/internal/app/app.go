package app

import "github.com/jostan30/Percy_chrome_ext/go-backend/internal/service"

type App struct {
	SnapshotService *service.SnapshotService
	BuildService *service.BuildService
}