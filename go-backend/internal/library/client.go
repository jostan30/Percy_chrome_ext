package library

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

const (
	percyAPI       = "https://percy.io/api/v1"
	requestTimeout = 15 * time.Second
)

// Client talks to Percy's read-only API and converts Percy's JSON:API
// payloads into SnapshotReference values.
//
// Percy JSON:API structures never leave this package.
type Client struct {
	token string
	http  *http.Client
}

func NewClient(token string) *Client {
	return &Client{
		token: token,
		http: &http.Client{
			Timeout: requestTimeout,
		},
	}
}

// ----------------------------------------------------------------------
// HTTP
// ----------------------------------------------------------------------

func (c *Client) do(req *http.Request, out any) error {
	req.Header.Set("Authorization", "Token token="+c.token)
	req.Header.Set("User-Agent", "Percy-Local-Manager/1.0")
	req.Header.Set("Accept", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf(
			"percy returned status %d for %s",
			resp.StatusCode,
			req.URL.String(),
		)
	}

	return json.NewDecoder(resp.Body).Decode(out)
}

// ----------------------------------------------------------------------
// Builds
// ----------------------------------------------------------------------

type buildAttributes struct {
	CreatedAt string `json:"created-at"`
}

type build struct {
	ID         string          `json:"id"`
	Attributes buildAttributes `json:"attributes"`
}

type buildResponse struct {
	Data []build `json:"data"`
}

func (c *Client) fetchBuilds() ([]build, error) {
	req, err := http.NewRequest(
		http.MethodGet,
		percyAPI+"/builds",
		nil,
	)
	if err != nil {
		return nil, err
	}

	var res buildResponse

	if err := c.do(req, &res); err != nil {
		return nil, fmt.Errorf("fetching builds: %w", err)
	}

	return res.Data, nil
}

// createdAt parses the build's created-at timestamp.
//
// Builds that fail to parse, or have no timestamp, sort as oldest.
func (b build) createdAt() time.Time {
	if b.Attributes.CreatedAt == "" {
		return time.Time{}
	}

	t, err := time.Parse(
		time.RFC3339,
		b.Attributes.CreatedAt,
	)

	if err != nil {
		return time.Time{}
	}

	return t
}

// ----------------------------------------------------------------------
// Snapshots
// ----------------------------------------------------------------------

type snapshotAttributes struct {
	Name             string `json:"name"`
	TestCaseName     string `json:"test-case-name"`
	EnableJavaScript bool   `json:"enable-javascript"`
	ScopeSelector    string `json:"scope-selector"`
}

type relationshipRef struct {
	Data struct {
		ID string `json:"id"`
	} `json:"data"`
}

type snapshotRelationships struct {
	Comparisons struct {
		Data []struct {
			ID string `json:"id"`
		} `json:"data"`
	} `json:"comparisons"`
}

type snapshot struct {
	ID            string                `json:"id"`
	Attributes    snapshotAttributes    `json:"attributes"`
	Relationships snapshotRelationships `json:"relationships"`
}

type snapshotResponse struct {
	Data     []snapshot       `json:"data"`
	Included []includedObject `json:"included"`
}

func (c *Client) fetchSnapshots(buildID string) (*snapshotResponse, error) {
	url := percyAPI + "/snapshots?build_id=" + buildID

	req, err := http.NewRequest(
		http.MethodGet,
		url,
		nil,
	)

	if err != nil {
		return nil, err
	}

	var res snapshotResponse

	if err := c.do(req, &res); err != nil {
		return nil, fmt.Errorf(
			"fetching snapshots for build %s: %w",
			buildID,
			err,
		)
	}

	return &res, nil
}

// ----------------------------------------------------------------------
// Included objects
// ----------------------------------------------------------------------
//
// Percy uses JSON:API's included[] array.
//
// Snapshot
//   ↓
// Comparison
//   ↓
// Head Screenshot
//   ↓
// Image
//   ↓
// Image URL
//
// We build an index once per build so that resolving each comparison
// remains O(1).

type includedObject struct {
	Type          string          `json:"type"`
	ID            string          `json:"id"`
	Attributes    json.RawMessage `json:"attributes"`
	Relationships json.RawMessage `json:"relationships"`
}

// ----------------------------------------------------------------------
// Comparisons
// ----------------------------------------------------------------------

type comparisonAttributes struct {
	Width int `json:"width"`
}

type comparisonRelationships struct {
	HeadScreenshot relationshipRef `json:"head-screenshot"`
}

type comparisonData struct {
	Attributes    comparisonAttributes
	Relationships comparisonRelationships
}

// ----------------------------------------------------------------------
// Screenshots
// ----------------------------------------------------------------------

type screenshotRelationships struct {
	Image relationshipRef `json:"image"`
}

// ----------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------

type imageAttributes struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

// ----------------------------------------------------------------------
// Included index
// ----------------------------------------------------------------------

type includedIndex struct {
	comparisons map[string]comparisonData
	screenshots map[string]screenshotRelationships
	images      map[string]imageAttributes
}

func buildIncludedIndex(
	included []includedObject,
) *includedIndex {

	idx := &includedIndex{
		comparisons: make(map[string]comparisonData),
		screenshots: make(map[string]screenshotRelationships),
		images:      make(map[string]imageAttributes),
	}

	for _, item := range included {
		switch item.Type {

		case "comparisons":
			var attrs comparisonAttributes

			if err := json.Unmarshal(
				item.Attributes,
				&attrs,
			); err != nil {
				continue
			}

			var rel comparisonRelationships

			if err := json.Unmarshal(
				item.Relationships,
				&rel,
			); err != nil {
				continue
			}

			idx.comparisons[item.ID] = comparisonData{
				Attributes:    attrs,
				Relationships: rel,
			}

		case "screenshots":
			var rel screenshotRelationships

			if err := json.Unmarshal(
				item.Relationships,
				&rel,
			); err != nil {
				continue
			}

			idx.screenshots[item.ID] = rel

		case "images":
			var attrs imageAttributes

			if err := json.Unmarshal(
				item.Attributes,
				&attrs,
			); err != nil {
				continue
			}

			idx.images[item.ID] = attrs
		}
	}

	return idx
}

// ----------------------------------------------------------------------
// Resolve all comparisons for a snapshot
// ----------------------------------------------------------------------
//
// A Percy snapshot can have multiple comparisons:
//
// snapshot
//   ├── comparison @ 375px
//   ├── comparison @ 768px
//   └── comparison @ 1280px
//
// Each comparison points to a head screenshot, which points to an image.
//
// We return all of them instead of only the first comparison.

func (idx *includedIndex) resolveComparisons(
	s snapshot,
) []SnapshotComparison {

	result := make(
		[]SnapshotComparison,
		0,
		len(s.Relationships.Comparisons.Data),
	)

	for _, comparisonRef := range s.Relationships.Comparisons.Data {
		comparison, ok := idx.comparisons[comparisonRef.ID]

		if !ok {
			continue
		}

		screenshotID :=
			comparison.Relationships.HeadScreenshot.Data.ID

		if screenshotID == "" {
			continue
		}

		screenshot, ok := idx.screenshots[screenshotID]

		if !ok {
			continue
		}

		imageID := screenshot.Image.Data.ID

		if imageID == "" {
			continue
		}

		image, ok := idx.images[imageID]

		if !ok {
			continue
		}

		result = append(
			result,
			SnapshotComparison{
				ID:         comparisonRef.ID,
				Width:      comparison.Attributes.Width,
				PreviewURL: image.URL,
				Height:     image.Height,
			},
		)
	}

	return result
}

// ----------------------------------------------------------------------
// Build snapshots
// ----------------------------------------------------------------------
//
// buildSnapshots pairs a fetched build with its snapshots.
//
// buildRank:
//   0 = newest build
//   1 = second newest
//   2 = third newest
//
// This allows deduplication to prefer the newest snapshot.

type buildSnapshots struct {
	buildRank int
	refs      []SnapshotReference
}

// ----------------------------------------------------------------------
// Load library
// ----------------------------------------------------------------------

// LoadLibrary fetches every build, fetches every build's snapshots
// concurrently, resolves all comparison preview images, and returns
// SnapshotReference values.
//
// The rest of the application never sees Percy's JSON:API structures.
func (c *Client) LoadLibrary() ([]SnapshotReference, error) {

	builds, err := c.fetchBuilds()

	if err != nil {
		return nil, err
	}

	log.Printf(
		"[library] fetched %d builds from percy",
		len(builds),
	)

	// Newest builds first.
	sortBuildsNewestFirst(builds)

	type fetchResult struct {
		bs  buildSnapshots
		err error
	}

	resultsCh := make(
		chan fetchResult,
		len(builds),
	)

	// Fetch each build concurrently.
	for rank, b := range builds {

		go func(rank int, b build) {

			refs, err := c.snapshotsForBuild(b)

			if err != nil {
				resultsCh <- fetchResult{
					err: err,
				}
				return
			}

			resultsCh <- fetchResult{
				bs: buildSnapshots{
					buildRank: rank,
					refs:      refs,
				},
			}

		}(rank, b)
	}

	all := make(
		[]buildSnapshots,
		0,
		len(builds),
	)

	for range builds {

		r := <-resultsCh

		if r.err != nil {
			log.Printf(
				"[library] error fetching snapshots: %v",
				r.err,
			)

			return nil, r.err
		}

		all = append(all, r.bs)
	}

	result := dedupeNewestFirst(all)

	log.Printf(
		"[library] cached %d unique snapshots (deduped from %d builds)",
		len(result),
		len(builds),
	)

	return result, nil
}

// ----------------------------------------------------------------------
// Fetch snapshots for one build
// ----------------------------------------------------------------------

func (c *Client) snapshotsForBuild(
	b build,
) ([]SnapshotReference, error) {

	snapshotsRes, err := c.fetchSnapshots(b.ID)

	if err != nil {
		return nil, err
	}

	idx := buildIncludedIndex(
		snapshotsRes.Included,
	)

	refs := make(
		[]SnapshotReference,
		0,
		len(snapshotsRes.Data),
	)

	missingComparisons := 0

	for _, s := range snapshotsRes.Data {

		comparisons := idx.resolveComparisons(s)

		if len(comparisons) == 0 {
			missingComparisons++
		}

		refs = append(
			refs,
			SnapshotReference{
				ID:               s.ID,
				Name:             s.Attributes.Name,
				TestCaseName:     s.Attributes.TestCaseName,
				BuildID:          b.ID,
				EnableJavaScript: s.Attributes.EnableJavaScript,
				Scope:            s.Attributes.ScopeSelector,
				Comparisons:      comparisons,
			},
		)
	}

	log.Printf(
		"[library] build %s -> %d snapshots (%d missing comparisons)",
		b.ID,
		len(refs),
		missingComparisons,
	)

	return refs, nil
}

// ----------------------------------------------------------------------
// Sort builds newest first
// ----------------------------------------------------------------------

func sortBuildsNewestFirst(
	builds []build,
) {

	// Simple insertion sort.
	//
	// Build lists are normally small, so this keeps the implementation
	// straightforward without additional complexity.

	for i := 1; i < len(builds); i++ {

		for j := i; j > 0 &&
			builds[j].createdAt().After(
				builds[j-1].createdAt(),
			); j-- {

			builds[j], builds[j-1] =
				builds[j-1], builds[j]
		}
	}
}

// ----------------------------------------------------------------------
// Deduplicate snapshots
// ----------------------------------------------------------------------
//
// Keeps exactly one SnapshotReference per snapshot name.
//
// If the same name exists in multiple builds, the newest build wins.

func dedupeNewestFirst(
	all []buildSnapshots,
) []SnapshotReference {

	bestRank := make(
		map[string]int,
	)

	best := make(
		map[string]SnapshotReference,
	)

	for _, bs := range all {

		for _, ref := range bs.refs {

			rank, seen := bestRank[ref.Name]

			if !seen || bs.buildRank < rank {

				bestRank[ref.Name] = bs.buildRank
				best[ref.Name] = ref
			}
		}
	}

	out := make(
		[]SnapshotReference,
		0,
		len(best),
	)

	for _, ref := range best {
		out = append(out, ref)
	}

	return out
}
