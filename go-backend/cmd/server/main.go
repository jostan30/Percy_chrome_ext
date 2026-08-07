package main 

import (
	"log"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/service"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/percy"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/library"
)

func main () {
	store := snapshot.NewMemoryStore()

	snapshotService := service.NewSnapshotService(store)

	binary := percy.NewBinary()
	controller := percy.NewController(binary)
	client := percy.NewClient()

	buildService := service.NewBuildService(
		controller,
		client,
		snapshotService,
	)

	libraryService := library.NewService()

	application := &app.App{
		SnapshotService: snapshotService,
		BuildService: buildService,
		LibraryService: libraryService,
	}

	server := api.NewServer(":4321" ,application)

	log.Println("Starting server on port http://localhost:4321")

	if err := server.Start(); err != nil {
		log.Fatal(err)
	}

}