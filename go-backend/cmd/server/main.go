package main 

import (
	"log"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api"
)

func main () {
	server := api.NewServer(":4321")

	log.Println("Starting server on port http://localhost:4321")

	if err := server.Start(); err != nil {
		log.Fatal(err)
	}

}