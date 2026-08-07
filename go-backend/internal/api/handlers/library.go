package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/app"
	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/httpx"
)

type LibraryHandler struct {
	app *app.App
}

func NewLibraryHandler(app *app.App) *LibraryHandler {
	return &LibraryHandler{
		app: app,
	}
}

type SetTokenRequest struct {
	Token string `json:"token"`
}

func (h *LibraryHandler) SetToken(
	w http.ResponseWriter,
	r *http.Request,
) {

	var req SetTokenRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.app.LibraryService.SetToken(req.Token); err != nil {
		http.Error(w, err.Error() ,http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(
		w,
		http.StatusOK,
		map[string]string{
			"status": "token set",
		},
	)
}

func(h *LibraryHandler) Search(w http.ResponseWriter ,r *http.Request) {
	query := r.URL.Query().Get("q")

	results := h.app.LibraryService.Search(query)

	httpx.WriteJSON(
		w,
		http.StatusOK,
		results,
	)
}