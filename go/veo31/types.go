package veo31

// Veo31Model selects the Veo 3.1 model variant. See [ModelVeo31] and [ModelVeo31Fast].
type Veo31Model string

// InputMode controls how the video is seeded: pure text, first/last frame images, or reference images.
type InputMode string

// AspectRatio controls the output video aspect ratio.
type AspectRatio string

// OutputResolution controls the upscaled video resolution.
type OutputResolution string

// TaskStatus is the async task lifecycle state (e.g. "processing", "completed", "failed").
type TaskStatus string

const (
	// ModelVeo31 is the full-quality model. Higher fidelity and longer generation time.
	ModelVeo31 Veo31Model = "veo-3.1"
	// ModelVeo31Fast is the low-latency model. Faster generation at reduced fidelity.
	ModelVeo31Fast Veo31Model = "veo-3.1-fast"

	// OutputResolution1080P upscales to 1080p (1920x1080).
	OutputResolution1080P OutputResolution = "1080p"
	// OutputResolution4K upscales to 4K (3840x2160). Higher detail, higher cost.
	OutputResolution4K OutputResolution = "4k"
)

// TextToVideoParams configures video generation. Supports three input modes controlled by InputMode:
//   - text (default): generate entirely from a text prompt.
//   - first_and_last_frames: animate between FirstFrameImageURL and LastFrameImageURL.
//   - reference: guide generation with 1-3 ReferenceImageURLs for style or subject consistency.
//
// DurationSeconds accepts 4, 6, or 8 seconds.
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
	ReferenceImageURLs []string    `json:"reference_image_urls" help:"optional; 1-3 reference image URLs for reference input mode"`
}

// ExtendVideoParams configures video extension. SourceTaskID must reference a completed
// TextToVideo or ExtendVideo task; the new footage continues from where that video ended.
type ExtendVideoParams struct {
	SourceTaskID string `json:"source_task_id" help:"required; source task ID to extend"`
	Prompt       string `json:"prompt" help:"required; extension description"`
	Seeds        *int   `json:"seeds,omitempty" help:"optional; 10000-99999"`
	Watermark    string `json:"watermark,omitempty" help:"optional; watermark text"`
	CallbackURL  string `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

// UpscaleVideoParams configures resolution upscaling for a previously generated video.
// SourceTaskID must reference a completed TextToVideo or ExtendVideo task.
// Use Index to select a specific video when the source task produced multiple outputs.
type UpscaleVideoParams struct {
	SourceTaskID     string           `json:"source_task_id" help:"required; source task ID to upscale"`
	OutputResolution OutputResolution `json:"output_resolution" help:"required; output resolution"`
	Index            *int             `json:"index,omitempty" help:"optional; video index within the task"`
	CallbackURL      string           `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

// AsyncTaskResponse carries the task ID, lifecycle status, and error for all Veo 3.1 async operations.
type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

// VideoMetadata describes a single generated video, including its download URL,
// resolution, and whether it contains an audio track.
type VideoMetadata struct {
	URL        string `json:"url"`
	Resolution string `json:"resolution,omitempty"`
	HasAudio   bool   `json:"has_audio,omitempty"`
}

// Source holds a URL to one of the input images used for the generation.
type Source struct {
	URL string `json:"url"`
}

// TextToVideoResponse is the result of a text-to-video generation task.
// Videos is populated once the task completes.
type TextToVideoResponse struct {
	AsyncTaskResponse
	Model   Veo31Model      `json:"model,omitempty"`
	Videos  []VideoMetadata `json:"videos,omitempty"`
	Sources []Source        `json:"sources,omitempty"`
}

// ExtendVideoResponse is the result of a video extension task.
type ExtendVideoResponse struct {
	AsyncTaskResponse
	Videos  []VideoMetadata `json:"videos,omitempty"`
	Sources []Source        `json:"sources,omitempty"`
}

// UpscaleVideoResponse is the result of a video upscale task.
type UpscaleVideoResponse struct {
	AsyncTaskResponse
	SourceTaskID string          `json:"source_task_id,omitempty"`
	Videos       []VideoMetadata `json:"videos,omitempty"`
	Sources      []Source        `json:"sources,omitempty"`
	MediaIDs     []string        `json:"media_ids,omitempty"`
}
