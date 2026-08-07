package library

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

const (
	percyAPI      = "https://percy.io/api/v1"
	requestTimeout = 15 * time.Second
)

// Client talks to Percy's read-only API and converts Percy's JSON:API
// payloads into SnapshotReference values. No Percy-shaped type defined in
// this file is ever returned from LoadLibrary — callers only ever see
// SnapshotReference.
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
		return fmt.Errorf("percy returned status %d for %s", resp.StatusCode, req.URL.String())
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
	req, err := http.NewRequest(http.MethodGet, percyAPI+"/builds", nil)
	if err != nil {
		return nil, err
	}

	var res buildResponse
	if err := c.do(req, &res); err != nil {
		return nil, fmt.Errorf("fetching builds: %w", err)
	}

	return res.Data, nil
}

// createdAt parses the build's created-at timestamp. Builds that fail to
// parse (or have no timestamp) sort as oldest, so they never incorrectly
// win a "prefer the newest" dedup.
func (b build) createdAt() time.Time {
	if b.Attributes.CreatedAt == "" {
		return time.Time{}
	}
	t, err := time.Parse(time.RFC3339, b.Attributes.CreatedAt)
	if err != nil {
		return time.Time{}
	}
	return t
}

// ----------------------------------------------------------------------
// Snapshots
// ----------------------------------------------------------------------

type snapshotAttributes struct {
	Name         string `json:"name"`
	TestCaseName string `json:"test-case-name"`
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

// includedObject is a single entry in Percy's polymorphic `included[]`
// array. Its actual shape depends on Type, so Attributes/Relationships are
// decoded lazily by the index builder below.
type includedObject struct {
	Type          string          `json:"type"`
	ID            string          `json:"id"`
	Attributes    json.RawMessage `json:"attributes"`
	Relationships json.RawMessage `json:"relationships"`
}

type snapshotResponse struct {
	Data     []snapshot       `json:"data"`
	Included []includedObject `json:"included"`
}

func (c *Client) fetchSnapshots(buildID string) (*snapshotResponse, error) {
	req, err := http.NewRequest(http.MethodGet, percyAPI+"/snapshots?build_id="+buildID, nil)
	if err != nil {
		return nil, err
	}

	var res snapshotResponse
	if err := c.do(req, &res); err != nil {
		return nil, fmt.Errorf("fetching snapshots for build %s: %w", buildID, err)
	}

	return &res, nil
}

// ----------------------------------------------------------------------
// Relationship traversal: snapshot -> comparison -> head-screenshot -> image
// ----------------------------------------------------------------------

type comparisonRelationships struct {
	HeadScreenshot relationshipRef `json:"head-screenshot"`
}

type screenshotRelationships struct {
	Image relationshipRef `json:"image"`
}

type imageAttributes struct {
	URL string `json:"url"`
}

// includedIndex is a one-time-per-build lookup built from the `included[]`
// array, so resolving a preview URL for each snapshot in the build is O(1)
// instead of re-parsing `included` for every snapshot.
type includedIndex struct {
	comparisons map[string]comparisonRelationships
	screenshots map[string]screenshotRelationships
	images      map[string]imageAttributes
}

func buildIncludedIndex(included []includedObject) *includedIndex {
	idx := &includedIndex{
		comparisons: make(map[string]comparisonRelationships),
		screenshots: make(map[string]screenshotRelationships),
		images:      make(map[string]imageAttributes),
	}

	for _, item := range included {
		switch item.Type {
		case "comparisons":
			var rel comparisonRelationships
			if err := json.Unmarshal(item.Relationships, &rel); err != nil {
				continue
			}
			idx.comparisons[item.ID] = rel

		case "screenshots":
			var rel screenshotRelationships
			if err := json.Unmarshal(item.Relationships, &rel); err != nil {
				continue
			}
			idx.screenshots[item.ID] = rel

		case "images":
			var attrs imageAttributes
			if err := json.Unmarshal(item.Attributes, &attrs); err != nil {
				continue
			}
			idx.images[item.ID] = attrs
		}
	}

	return idx
}

// resolvePreviewURL walks snapshot -> comparison -> head-screenshot -> image
// -> attributes.url. Returns "" if any hop in the chain is missing rather
// than erroring, since a missing preview shouldn't fail the whole library.
func (idx *includedIndex) resolvePreviewURL(s snapshot) string {
	if len(s.Relationships.Comparisons.Data) == 0 {
		return ""
	}

	comparisonID := s.Relationships.Comparisons.Data[0].ID
	comparison, ok := idx.comparisons[comparisonID]
	if !ok {
		return ""
	}

	screenshotID := comparison.HeadScreenshot.Data.ID
	if screenshotID == "" {
		return ""
	}
	screenshotRel, ok := idx.screenshots[screenshotID]
	if !ok {
		return ""
	}

	imageID := screenshotRel.Image.Data.ID
	if imageID == "" {
		return ""
	}
	imageAttrs, ok := idx.images[imageID]
	if !ok {
		return ""
	}

	return imageAttrs.URL
}

// ----------------------------------------------------------------------
// Public entry point
// ----------------------------------------------------------------------

// buildSnapshots pairs a fetched build with its resolved snapshots, ordered
// most-recent-build-first, so the caller can dedup by preferring the
// snapshot from the newest build without racing on goroutine completion
// order.
type buildSnapshots struct {
	buildRank int // 0 = newest build
	refs      []SnapshotReference
}

// LoadLibrary fetches every build, fetches every build's snapshots
// concurrently, resolves each snapshot's preview image through Percy's
// relationship graph, and returns SnapshotReference values only. Callers
// never see builds[], data[], included[], or any other Percy JSON:API
// shape.
func (c *Client) LoadLibrary() ([]SnapshotReference, error) {
	builds, err := c.fetchBuilds()
	if err != nil {
		return nil, err
	}

	log.Printf("[library] fetched %d builds from percy", len(builds))

	// Newest first, so buildRank (the slice index) doubles as a recency
	// rank: lower rank == newer build.
	sortBuildsNewestFirst(builds)

	type fetchResult struct {
		bs  buildSnapshots
		err error
	}

	resultsCh := make(chan fetchResult, len(builds))

	for rank, b := range builds {
		go func(rank int, b build) {
			refs, err := c.snapshotsForBuild(b)
			if err != nil {
				resultsCh <- fetchResult{err: err}
				return
			}
			resultsCh <- fetchResult{bs: buildSnapshots{buildRank: rank, refs: refs}}
		}(rank, b)
	}

	all := make([]buildSnapshots, 0, len(builds))
	for range builds {
		r := <-resultsCh
		if r.err != nil {
			log.Printf("[library] error fetching snapshots: %v", r.err)
			return nil, r.err
		}
		all = append(all, r.bs)
	}

	result := dedupeNewestFirst(all)
	log.Printf("[library] cached %d unique snapshots (deduped from %d builds)", len(result), len(builds))

	return result, nil
}

func (c *Client) snapshotsForBuild(b build) ([]SnapshotReference, error) {
	snapshotsRes, err := c.fetchSnapshots(b.ID)
	if err != nil {
		return nil, err
	}

	idx := buildIncludedIndex(snapshotsRes.Included)

	refs := make([]SnapshotReference, 0, len(snapshotsRes.Data))
	missingPreview := 0
	for _, s := range snapshotsRes.Data {
		previewURL := idx.resolvePreviewURL(s)
		if previewURL == "" {
			missingPreview++
		}
		refs = append(refs, SnapshotReference{
			Name:         s.Attributes.Name,
			PreviewURL:   previewURL,
			TestCaseName: s.Attributes.TestCaseName,
			BuildID:      b.ID,
		})
	}

	log.Printf("[library] build %s -> %d snapshots (%d missing preview)", b.ID, len(refs), missingPreview)

	return refs, nil
}

func sortBuildsNewestFirst(builds []build) {
	// Simple insertion sort: build lists are small (typically dozens, not
	// thousands), so this avoids pulling in "sort" for a one-line compare.
	for i := 1; i < len(builds); i++ {
		for j := i; j > 0 && builds[j].createdAt().After(builds[j-1].createdAt()); j-- {
			builds[j], builds[j-1] = builds[j-1], builds[j]
		}
	}
}

// dedupeNewestFirst keeps exactly one SnapshotReference per name, preferring
// the one from the lowest buildRank (i.e. the newest build). This is
// deterministic regardless of which goroutine in LoadLibrary finished first.
func dedupeNewestFirst(all []buildSnapshots) []SnapshotReference {
	bestRank := make(map[string]int)
	best := make(map[string]SnapshotReference)

	for _, bs := range all {
		for _, ref := range bs.refs {
			rank, seen := bestRank[ref.Name]
			if !seen || bs.buildRank < rank {
				bestRank[ref.Name] = bs.buildRank
				best[ref.Name] = ref
			}
		}
	}

	out := make([]SnapshotReference, 0, len(best))
	for _, ref := range best {
		out = append(out, ref)
	}

	return out
}