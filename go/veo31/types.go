package veo31

type Veo31Model string

type InputMode string

type AspectRatio string

type OutputResolution string

type TaskStatus string

const (
	ModelVeo31     Veo31Model = "veo-3.1"
	ModelVeo31Fast Veo31Model = "veo-3.1-fast"

	OutputResolution1080P OutputResolution = "1080p"
	OutputResolution4K    OutputResolution = "4k"
)

type TextToVideoParams struct {
	Prompt             string      `json:"prompt" help:"required; video description"`
	Model              Veo31Model  `json:"model" help:"optional; model slug"`
	InputMode          InputMode   `json:"input_mode,omitempty" help:"optional; input mode"`
	AspectRatio        AspectRatio `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio"`
	DurationSeconds    *int        `json:"duration_seconds,omitempty" help:"optional; duration in seconds"`
	Seeds              *int        `json:"seeds,omitempty" help:"optional; 10000-99999 for reproducibility"`
	CallbackURL        string      `json:"callback_url,omitempty" help:"optional; webhook URL"`
	EnableTranslation  *bool       `json:"enable_translation,omitempty" help:"optional; auto-translate prompt to English (default: true)"`
	Watermark          string      `json:"watermark,omitempty" help:"optional; watermark text"`
	FirstFrameImageURL string      `json:"first_frame_image_url,omitempty" help:"optional; required for first_and_last_frames input mode"`
	LastFrameImageURL  string      `json:"last_frame_image_url,omitempty" help:"optional; last frame image URL for first_and_last_frames input mode"`
	ReferenceImageURLs []string    `json:"reference_image_urls,omitempty" help:"optional; 1-3 reference image URLs for reference input mode"`
}

type ExtendVideoParams struct {
	SourceTaskID string `json:"source_task_id" help:"required; source task ID to extend"`
	Prompt       string `json:"prompt" help:"required; extension description"`
	Seeds        *int   `json:"seeds,omitempty" help:"optional; 10000-99999"`
	Watermark    string `json:"watermark,omitempty" help:"optional; watermark text"`
	CallbackURL  string `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

type UpscaleVideoParams struct {
	SourceTaskID     string           `json:"source_task_id" help:"required; source task ID to upscale"`
	OutputResolution OutputResolution `json:"output_resolution" help:"required; output resolution"`
	Index            *int             `json:"index,omitempty" help:"optional; video index within the task"`
	CallbackURL      string           `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

type VideoMetadata struct {
	URL        string `json:"url"`
	Resolution string `json:"resolution,omitempty"`
	HasAudio   bool   `json:"has_audio,omitempty"`
}

type Source struct {
	URL string `json:"url"`
}

type TextToVideoResponse struct {
	AsyncTaskResponse
	Model   Veo31Model      `json:"model,omitempty"`
	Videos  []VideoMetadata `json:"videos,omitempty"`
	Sources []Source        `json:"sources,omitempty"`
}

type ExtendVideoResponse struct {
	AsyncTaskResponse
	Videos  []VideoMetadata `json:"videos,omitempty"`
	Sources []Source        `json:"sources,omitempty"`
}

type UpscaleVideoResponse struct {
	AsyncTaskResponse
	SourceTaskID string          `json:"source_task_id,omitempty"`
	Videos       []VideoMetadata `json:"videos,omitempty"`
	Sources      []Source        `json:"sources,omitempty"`
	MediaIDs     []string        `json:"media_ids,omitempty"`
}
