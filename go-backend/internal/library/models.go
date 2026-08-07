package library

// SnapshotReference is the only shape the rest of the application (and the
// Chrome Extension, via JSON) ever sees. Percy's JSON:API structures never
// leave client.go.
type SnapshotReference struct {
	Name         string `json:"name"`
	PreviewURL   string `json:"previewUrl"`
	TestCaseName string `json:"testCaseName,omitempty"`
	BuildID      string `json:"buildId,omitempty"`
}