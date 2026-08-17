package dto

import (
	"errors"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
)

type CreateSnapshotRequest struct {
	Name string `json:"name"`
	URL string 	`json:"url"`
	DOM string `json:"dom"`
	ViewportWidth int `json:"viewportWidth"`
	ViewportHeight int `json:"viewportHeight"`
	EnableJavaScript bool   `json:"enableJavaScript"`
	PercyCSS         string `json:"percyCSS"`
}

func (r CreateSnapshotRequest) Validate() error {
	if r.Name == "" {
		return errors.New("name is required")
	}

	if r.URL == "" {
		return errors.New("url is required")
	}

	if r.DOM == "" {
		return errors.New("DOM is required")
	}

	if r.ViewportWidth <= 0 {
		return errors.New("viewportWidth must be greater than zero")
	}

	if r.ViewportHeight <=0 {
		return errors.New("viewportHeight must be greater than zero")
	}
	return nil
}

func (r CreateSnapshotRequest) ToSnapshot() snapshot.Snapshot {
	return snapshot.Snapshot {
		Name: r.Name,
		URL: r.URL,
		DOM: r.DOM,
		ViewportWidth: r.ViewportWidth,
		ViewportHeight: r.ViewportHeight,
		EnableJavaScript: r.EnableJavaScript,
		PercyCSS:         r.PercyCSS,
	}
}