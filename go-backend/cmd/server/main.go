package main 

import (
	"log"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
)

func main () {
	store := snapshot.NewMemoryStore()

	application := &app.App {
		Snapshots: store,
	}
	server := api.NewServer(":4321" ,application)

	log.Println("Starting server on port http://localhost:4321")

	if err := server.Start(); err != nil {
		log.Fatal(err)
	}

}