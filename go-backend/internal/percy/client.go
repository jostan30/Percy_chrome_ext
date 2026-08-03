package percy

import (
	"encoding/json"
	"net/http"
)

type Client struct {
	baseURL string
	client *http.Client
}

func NewClient() *Client {
	return &Client{
		baseURL : "http://localhost:5338",
		client: &http.Client{},
	}
}

func (c *Client) Health() (*HealthResponse ,error) {
	resp ,err := c.client.Get(c.baseURL + "/percy/healthcheck")
	if err != nil {
		return nil ,err
	}
	defer resp.Body.Close()

	var health HealthResponse

	if err := json.NewDecoder(resp.Body).Decode(&health); err != nil {
		return nil, err
	}

	return &health ,nil
}