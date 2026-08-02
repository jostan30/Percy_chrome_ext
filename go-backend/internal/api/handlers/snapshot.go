package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
)

type SnapshotHandler struct {
	app *app.App
}

func NewSnapshotHandler(app * app.App) *SnapshotHandler {
	return &SnapshotHandler {
		app: app,
	}
}


func (h *SnapshotHandler) Create(w http.ResponseWriter ,r *http.Request) {
	var s snapshot.Snapshot

	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		httpx.WriteJSON(w ,http.StatusBadRequest ,map[string]string{
			"error": "invalid request body",
		})
		return
	}

	h.app.Snapshots.Add(s)

	httpx.WriteJSON(w, http.StatusCreated ,map[string]string{
		"message":"Snapshot created",
	})
}

func (h *SnapshotHandler) List(w http.ResponseWriter ,r *http.Request) {
	httpx.WriteJSON(w , http.StatusOK ,h.app.Snapshots.All())
}

func (h *SnapshotHandler) Clear(w http.ResponseWriter ,r *http.Request) {
	h.app.Snapshots.Clear() 
	
	httpx.WriteJSON(w, http.StatusOK , map[string]string{
		"message": "Snapshots cleared",
	})
}