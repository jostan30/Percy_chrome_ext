package handlers

import (
	"net/http"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
)

func Health (w http.ResponseWriter , r *http.Request) {
	httpx.WriteJSON(w, http.StatusOK , map[string]any {
		"status":"ready",
	})
}

func Status (w http.ResponseWriter , r *http.Request) {
	httpx.WriteJSON(w, http.StatusOK , map[string]any {
		"running": true,
		"version": "1.0.0",
	})
}
