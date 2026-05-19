package veo31

type Veo31Model string

type GenerationType string

type AspectRatio string

type TargetResolution string

type TaskStatus string

const (
	ModelVeo31     Veo31Model = "veo-3.1"
	ModelVeo31Fast Veo31Model = "veo-3.1-fast"

	TargetResolution1080P TargetResolution = "1080p"
	TargetResolution4K    TargetResolution = "4k"
)

type TextToVideoParams struct {
	Prompt            string         `json:"prompt" help:"required; video description"`
	Model             Veo31Model   `json:"model" help:"optional; veo-3.1 or veo-3.1-fast (default: veo-3.1-fast)"`
	GenerationType    GenerationType `json:"generation_type,omitempty" help:"optional; TEXT_2_VIDEO, FIRST_AND_LAST_FRAMES_2_VIDEO, REFERENCE_2_VIDEO (auto-detected)"`
	AspectRatio       AspectRatio    `json:"aspect_ratio,omitempty" help:"optional; 16:9 (default), 9:16, auto"`
	Seeds             *int           `json:"seeds,omitempty" help:"optional; 10000-99999 for reproducibility"`
	CallbackURL       string         `json:"callback_url,omitempty" help:"optional; webhook URL"`
	EnableTranslation *bool          `json:"enable_translation,omitempty" help:"optional; auto-translate prompt to English (default: true)"`
	Watermark         string         `json:"watermark,omitempty" help:"optional; watermark text"`
	ImageURLs         []string       `json:"image_urls,omitempty" help:"optional; 1-3 reference image URLs for image-to-video"`
}

type ExtendVideoParams struct {
	TaskID      string `json:"task_id" help:"required; source task ID to extend"`
	Prompt      string `json:"prompt" help:"required; extension description"`
	Seeds       *int   `json:"seeds,omitempty" help:"optional; 10000-99999"`
	Watermark   string `json:"watermark,omitempty" help:"optional; watermark text"`
	CallbackURL string `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

type UpscaleVideoParams struct {
	TaskID           string           `json:"task_id" help:"required; source task ID to upscale"`
	TargetResolution TargetResolution `json:"target_resolution" help:"required; 1080p or 4k"`
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
	Model   Veo31Model    `json:"model,omitempty"`
	Videos  []VideoMetadata `json:"videos,omitempty"`
	Sources []Source        `json:"sources,omitempty"`
}

type ExtendVideoResponse struct {
	AsyncTaskResponse
	OriginalTaskID string          `json:"original_task_id,omitempty"`
	Videos         []VideoMetadata `json:"videos,omitempty"`
	Sources        []Source        `json:"sources,omitempty"`
}

type UpscaleVideoResponse struct {
	AsyncTaskResponse
	OriginalTaskID string         `json:"original_task_id,omitempty"`
	Video          *VideoMetadata `json:"video,omitempty"`
	Sources        []Source       `json:"sources,omitempty"`
	MediaIDs       []string       `json:"media_ids,omitempty"`
}
