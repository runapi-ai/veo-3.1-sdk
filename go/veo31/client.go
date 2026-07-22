// Package veo31 provides the Veo 3.1 video API client.
//
//	client, err := veo_3_1.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToVideo.Run(ctx, veo_3_1.TextToVideoParams{
//	    Model: veo_3_1.ModelVeo31, Prompt: "A drone shot over mountains at sunset",
//	})
package veo31

import (
	"context"

	"github.com/runapi-ai/core-sdk/go/base"
	"github.com/runapi-ai/core-sdk/go/core"
	"github.com/runapi-ai/core-sdk/go/option"
)

const (
	textToVideoPath  = "/api/v1/veo_3_1/text_to_video"
	extendVideoPath  = "/api/v1/veo_3_1/extend_video"
	upscaleVideoPath = "/api/v1/veo_3_1/upscale_video"
)

// Client provides Veo 3.1 video generation, extension, and upscaling operations.
type Client struct {
	base.Base
	// TextToVideo generates video from text, an image starting frame, or reference images.
	TextToVideo *TextToVideo
	// ExtendVideo appends footage to a previously generated video.
	ExtendVideo *ExtendVideo
	// UpscaleVideo increases video resolution to 1080p or 4K.
	UpscaleVideo *UpscaleVideo
}

// NewClient creates a Veo 3.1 client with the given options.
func NewClient(opts ...option.ClientOption) (*Client, error) {
	resolved, err := option.ResolveClientOptions(opts...)
	if err != nil {
		return nil, err
	}
	httpClient, err := core.NewHTTPClient(resolved)
	if err != nil {
		return nil, err
	}
	return NewClientWithHTTP(httpClient), nil
}

// NewClientWithHTTP creates a Veo 3.1 client with a pre-configured HTTP transport.
func NewClientWithHTTP(httpClient core.HTTPClient) *Client {
	return &Client{
		Base:         base.New(httpClient),
		TextToVideo:  &TextToVideo{http: httpClient},
		ExtendVideo:  &ExtendVideo{http: httpClient},
		UpscaleVideo: &UpscaleVideo{http: httpClient},
	}
}

// TextToVideo generates video from a text prompt. Optionally set FirstFrameImageURL
// to animate from a starting image, or use InputMode "reference" with ReferenceImageURLs
// for style/subject-guided generation.
type TextToVideo struct{ http core.HTTPClient }

// ExtendVideo appends additional footage to a previously generated video,
// continuing from where the source task left off. Requires the SourceTaskID
// of a completed TextToVideo task.
type ExtendVideo struct{ http core.HTTPClient }

// UpscaleVideo increases the resolution of a previously generated video to 1080p or 4K.
// Requires the SourceTaskID of a completed TextToVideo task.
type UpscaleVideo struct{ http core.HTTPClient }

// Create submits a text-to-video generation task and returns immediately with the task ID.
func (r *TextToVideo) Create(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	body := core.CompactParams(params)
	if err := core.ValidateParams(contractSchema["text-to-video"], body); err != nil {
		return nil, err
	}
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToVideoPath, body, requestOptions)
}

// Get retrieves the current status and result of a text-to-video task.
func (r *TextToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[TextToVideoResponse](ctx, r.http, core.ResourcePath(textToVideoPath, id), requestOptions)
}

// Run submits a text-to-video task and polls until it completes or fails.
func (r *TextToVideo) Run(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*TextToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// Create submits a video extension task and returns immediately with the task ID.
func (r *ExtendVideo) Create(ctx context.Context, params ExtendVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, extendVideoPath, core.CompactParams(params), requestOptions)
}

// Get retrieves the current status and result of a video extension task.
func (r *ExtendVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*ExtendVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[ExtendVideoResponse](ctx, r.http, core.ResourcePath(extendVideoPath, id), requestOptions)
}

// Run submits a video extension task and polls until it completes or fails.
func (r *ExtendVideo) Run(ctx context.Context, params ExtendVideoParams, opts ...option.RequestOption) (*ExtendVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*ExtendVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// Create submits a video upscale task and returns immediately with the task ID.
func (r *UpscaleVideo) Create(ctx context.Context, params UpscaleVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, upscaleVideoPath, core.CompactParams(params), requestOptions)
}

// Get retrieves the current status and result of a video upscale task.
func (r *UpscaleVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*UpscaleVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[UpscaleVideoResponse](ctx, r.http, core.ResourcePath(upscaleVideoPath, id), requestOptions)
}

// Run submits a video upscale task and polls until it completes or fails.
func (r *UpscaleVideo) Run(ctx context.Context, params UpscaleVideoParams, opts ...option.RequestOption) (*UpscaleVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*UpscaleVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}
