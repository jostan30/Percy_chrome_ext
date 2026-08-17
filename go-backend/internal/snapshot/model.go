package snapshot

import "time"

type Snapshot struct {
	ID	string	`json:"id"`
	Name	string	`json:"name"`
	URL	string	`json:"url"`
	DOM string	`json:"dom"`
	EnableJavaScript bool   `json:"enableJavaScript"`
	PercyCSS         string `json:"percyCSS,omitempty"`

	ViewportWidth	int	`json:"viewportWidth"`
	ViewportHeight int	`json:"viewportHeight"`

	CreatedAt	time.Time	`json:"createdAt"`
}