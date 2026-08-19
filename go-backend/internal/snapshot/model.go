package snapshot

import "time"

type Snapshot struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
	DOM  string `json:"dom"`

	// Percy snapshot options
	Widths           []int  `json:"widths"`
	MinHeight        int    `json:"minHeight"`
	PercyCSS         string `json:"percyCSS,omitempty"`
	EnableJavaScript bool   `json:"enableJavaScript"`
	Scope            string `json:"scope,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
}