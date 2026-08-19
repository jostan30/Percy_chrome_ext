package dto

import (
	"errors"
	"strings"

	"github.com/jostan30/Percy_chrome_ext/go-backend/internal/snapshot"
)

type CreateSnapshotRequest struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	DOM  string `json:"dom"`

	// New Percy options
	Widths           []int  `json:"widths,omitempty"`
	MinHeight        int    `json:"minHeight,omitempty"`
	PercyCSS         string `json:"percyCSS,omitempty"`
	EnableJavaScript bool   `json:"enableJavaScript,omitempty"`
	Scope            string `json:"scope,omitempty"`

	// Kept temporarily for backwards compatibility
	ViewportWidth  int `json:"viewportWidth,omitempty"`
	ViewportHeight int `json:"viewportHeight,omitempty"`
}

func (r CreateSnapshotRequest) Validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errors.New("name is required")
	}

	if strings.TrimSpace(r.URL) == "" {
		return errors.New("url is required")
	}

	if strings.TrimSpace(r.DOM) == "" {
		return errors.New("DOM is required")
	}

	// Support the old frontend while it is being migrated.
	if len(r.Widths) == 0 && r.ViewportWidth > 0 {
		r.Widths = []int{r.ViewportWidth}
	}

	if len(r.Widths) == 0 {
		return errors.New("at least one width is required")
	}

	for _, width := range r.Widths {
		if width <= 0 {
			return errors.New("widths must contain only positive values")
		}
	}

	if r.MinHeight < 0 {
		return errors.New("minHeight cannot be negative")
	}

	if r.MinHeight == 0 && r.ViewportHeight > 0 {
		r.MinHeight = r.ViewportHeight
	}

	return nil
}

func (r CreateSnapshotRequest) ToSnapshot() snapshot.Snapshot {
	widths := r.Widths

	if len(widths) == 0 && r.ViewportWidth > 0 {
		widths = []int{r.ViewportWidth}
	}

	minHeight := r.MinHeight

	if minHeight == 0 && r.ViewportHeight > 0 {
		minHeight = r.ViewportHeight
	}

	return snapshot.Snapshot{
		Name:             r.Name,
		URL:              r.URL,
		DOM:              r.DOM,
		Widths:           widths,
		MinHeight:        minHeight,
		PercyCSS:         r.PercyCSS,
		EnableJavaScript: r.EnableJavaScript,
		Scope:            r.Scope,
	}
}

// ------------------------------------------------------------
// Update Snapshot
// ------------------------------------------------------------

type UpdateSnapshotRequest struct {
	Name             *string `json:"name,omitempty"`
	URL              *string `json:"url,omitempty"`
	DOM              *string `json:"dom,omitempty"`
	Widths           *[]int `json:"widths,omitempty"`
	MinHeight        *int   `json:"minHeight,omitempty"`
	PercyCSS         *string `json:"percyCSS,omitempty"`
	EnableJavaScript *bool  `json:"enableJavaScript,omitempty"`
	Scope            *string `json:"scope,omitempty"`
}

func (r UpdateSnapshotRequest) Validate() error {
	if r.Name != nil && strings.TrimSpace(*r.Name) == "" {
		return errors.New("name cannot be empty")
	}

	if r.URL != nil && strings.TrimSpace(*r.URL) == "" {
		return errors.New("url cannot be empty")
	}

	if r.DOM != nil && strings.TrimSpace(*r.DOM) == "" {
		return errors.New("DOM cannot be empty")
	}

	if r.Widths != nil {
		if len(*r.Widths) == 0 {
			return errors.New("widths cannot be empty")
		}

		for _, width := range *r.Widths {
			if width <= 0 {
				return errors.New("widths must contain only positive values")
			}
		}
	}

	if r.MinHeight != nil && *r.MinHeight < 0 {
		return errors.New("minHeight cannot be negative")
	}

	return nil
}