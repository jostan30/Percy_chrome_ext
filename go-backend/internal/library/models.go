package library

// SnapshotReference is the only shape the rest of the application (and the
// Chrome Extension, via JSON) ever sees. Percy's JSON:API structures never
// leave client.go.
type SnapshotReference struct {
	ID               string               `json:"id"`
	Name             string               `json:"name"`
	TestCaseName     string               `json:"testCaseName,omitempty"`
	BuildID          string               `json:"buildId,omitempty"`
	EnableJavaScript bool                 `json:"enableJavaScript"`
	Scope            string               `json:"scope,omitempty"`
	Comparisons      []SnapshotComparison `json:"comparisons"`
}

type SnapshotComparison struct {
	ID         string `json:"id"`
	Width      int    `json:"width"`
	PreviewURL string `json:"previewUrl"`
	Height     int    `json:"height"`
}
