package percy

type HealthResponse struct {
	Success bool `json:"success"`

	Build struct {
		ID  string `json:"id"`
		URL string `json:"url"`
	} `json:"build"`
}

type SnapshotRequest struct {
	Name        string `json:"name"`
	URL         string `json:"url"`
	DomSnapshot string `json:"domSnapshot"`

	Widths    []int `json:"widths,omitempty"`
	MinHeight int   `json:"minHeight,omitempty"`

	EnvironmentInfo []string `json:"environmentInfo,omitempty"`
	ClientInfo      string   `json:"clientInfo,omitempty"`

	EnableJavaScript bool              `json:"enableJavaScript,omitempty"`
	RequestHeaders   map[string]string `json:"requestHeaders,omitempty"`

	PercyCSS string `json:"percyCSS,omitempty"`
	Scope    string `json:"scope,omitempty"`
}