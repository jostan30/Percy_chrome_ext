package percy

type HealthResponse struct {
	Sucess bool `json:"success"`

	Build struct {
		ID string `json:"id"`
		URL string `json:"url"`
	} `json:"build"`
}