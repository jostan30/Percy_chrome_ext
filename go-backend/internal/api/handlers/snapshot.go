package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api/dto"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
)

type SnapshotHandler struct {
	app *app.App
}

func NewSnapshotHandler(app *app.App) *SnapshotHandler {
	return &SnapshotHandler{
		app: app,
	}
}

// ------------------------------------------------------------
// POST /snapshots
// ------------------------------------------------------------

func (h *SnapshotHandler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var req dto.CreateSnapshotRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "invalid request body",
			},
		)
		return
	}

	if err := req.Validate(); err != nil {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": err.Error(),
			},
		)
		return
	}

	snap, err := h.app.SnapshotService.Create(
		req.ToSnapshot(),
	)

	if err != nil {
		httpx.WriteJSON(
			w,
			http.StatusInternalServerError,
			map[string]string{
				"error": err.Error(),
			},
		)
		return
	}

	httpx.WriteJSON(
		w,
		http.StatusCreated,
		map[string]any{
			"message":  "Snapshot created",
			"snapshot": snap,
		},
	)
}

// ------------------------------------------------------------
// GET /snapshots
// ------------------------------------------------------------

func (h *SnapshotHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	httpx.WriteJSON(
		w,
		http.StatusOK,
		h.app.SnapshotService.List(),
	)
}

// ------------------------------------------------------------
// PATCH /snapshots/:id
// ------------------------------------------------------------

func (h *SnapshotHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := snapshotID(r)

	if id == "" {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "snapshot id is required",
			},
		)
		return
	}

	var req dto.UpdateSnapshotRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "invalid request body",
			},
		)
		return
	}

	if err := req.Validate(); err != nil {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": err.Error(),
			},
		)
		return
	}

	updated, err := h.app.SnapshotService.Update(
		id,
		func(snap *snapshot.Snapshot) {
			if req.Name != nil {
				snap.Name = *req.Name
			}

			if req.URL != nil {
				snap.URL = *req.URL
			}

			if req.DOM != nil {
				snap.DOM = *req.DOM
			}

			if req.Widths != nil {
				snap.Widths = *req.Widths
			}

			if req.MinHeight != nil {
				snap.MinHeight = *req.MinHeight
			}

			if req.PercyCSS != nil {
				snap.PercyCSS = *req.PercyCSS
			}

			if req.EnableJavaScript != nil {
				snap.EnableJavaScript = *req.EnableJavaScript
			}

			if req.Scope != nil {
				snap.Scope = *req.Scope
			}
		},
	)

	if err != nil {
		if err.Error() == "snapshot not found" {
			httpx.WriteJSON(
				w,
				http.StatusNotFound,
				map[string]string{
					"error": err.Error(),
				},
			)
			return
		}

		httpx.WriteJSON(
			w,
			http.StatusInternalServerError,
			map[string]string{
				"error": err.Error(),
			},
		)
		return
	}

	httpx.WriteJSON(
		w,
		http.StatusOK,
		map[string]any{
			"message":  "Snapshot updated",
			"snapshot": updated,
		},
	)
}

// ------------------------------------------------------------
// DELETE /snapshots/:id
// ------------------------------------------------------------

func (h *SnapshotHandler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := snapshotID(r)

	if id == "" {
		httpx.WriteJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "snapshot id is required",
			},
		)
		return
	}

	deleted := h.app.SnapshotService.Delete(id)

	if !deleted {
		httpx.WriteJSON(
			w,
			http.StatusNotFound,
			map[string]string{
				"error": "snapshot not found",
			},
		)
		return
	}

	httpx.WriteJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "Snapshot deleted",
		},
	)
}

// ------------------------------------------------------------
// DELETE /snapshots
// ------------------------------------------------------------

func (h *SnapshotHandler) Clear(
	w http.ResponseWriter,
	r *http.Request,
) {
	h.app.SnapshotService.Clear()

	httpx.WriteJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "Snapshots cleared",
		},
	)
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

func snapshotID(r *http.Request) string {
	path := strings.TrimPrefix(
		r.URL.Path,
		"/snapshots/",
	)

	return strings.TrimSpace(path)
}