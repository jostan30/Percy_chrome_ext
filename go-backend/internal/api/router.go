package api

import (
	"net/http"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/api/handlers"
)

type Server struct {
	addr string 
	mux *http.ServeMux
}

func NewServer ( addr string) *Server {
	s:= &Server{
		addr: addr,
		mux: http.NewServeMux(),
	}

	s.routes()

	return s
}

func (s *Server) routes() {
	s.mux.HandleFunc("/health" , handlers.Health)
	s.mux.HandleFunc("/status" , handlers.Status)
}

func (s *Server) Start() error {
	return http.ListenAndServe(s.addr ,s.mux)
}

