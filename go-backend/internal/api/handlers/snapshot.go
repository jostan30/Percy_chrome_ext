package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api/dto"
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
	var req dto.CreateSnapshotRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteJSON(w ,http.StatusBadRequest ,map[string]string{
			"error": "invalid request body",
		})
		return
	}

	if err := req.Validate(); err != nil {
		httpx.WriteJSON(w, http.StatusBadRequest ,map[string]string{
			"error":err.Error(),
		})
		return
	}

	snap , err := h.app.SnapshotService.Create(req.ToSnapshot())
	if err !=nil {
		httpx.WriteJSON(w ,http.StatusInternalServerError ,map[string]string{
			"error": err.Error(),
		})
	}

	httpx.WriteJSON(w, http.StatusCreated ,map[string]any{
		"message":"Snapshot created",
		"snap": snap,
	})
}

func (h *SnapshotHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/snapshots/")

	if id == "" {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "snapshot id is required",
		})
		return
	}

	deleted := h.app.SnapshotService.Delete(id)

	if !deleted {
		httpx.WriteJSON(w, http.StatusNotFound, map[string]string{
			"error": "snapshot not found",
		})
		return
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Snapshot deleted",
	})
}

func (h *SnapshotHandler) List(w http.ResponseWriter ,r *http.Request) {
	httpx.WriteJSON(w , http.StatusOK ,h.app.SnapshotService.List())
}

func (h *SnapshotHandler) Clear(w http.ResponseWriter ,r *http.Request) {
	h.app.SnapshotService.Clear() 
	
	httpx.WriteJSON(w, http.StatusOK , map[string]string{
		"message": "Snapshots cleared",
	})
}