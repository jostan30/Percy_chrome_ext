package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
)

type BuildHandler struct {
	app *app.App
}

type FinalizeRequest struct {
	Token string `json:"token"`
}

func NewBuildHandler(app *app.App) *BuildHandler {
	return &BuildHandler{
		app: app,
	}
}

func (h *BuildHandler) Finalize(w http.ResponseWriter, r *http.Request) {
	var req FinalizeRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteJSON(w, http.StatusBadRequest ,map[string] string {
			"error":"invalid request",
		})
		return
	}

	if err := h.app.BuildService.Finalize(req.Token); err != nil {
		httpx.WriteJSON(w, http.StatusInternalServerError ,map [string] string {
			"error": err.Error(),
		})
		return
}

	httpx.WriteJSON(w, http.StatusOK, map[string] string {
		"message":"Percy started successfully",
	}) 
}