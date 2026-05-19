// Package veo31 provides the Veo 3.1 video API client.
//
//	client, err := veo_3_1.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToVideo.Run(ctx, veo_3_1.TextToVideoParams{
//	    Model: veo_3_1.ModelVeo31, Prompt: "A drone shot over mountains at sunset",
//	})
package veo31

import (
	"context"

	"github.com/runapi-ai/core-sdk/go/core"
	"github.com/runapi-ai/core-sdk/go/option"
)

const (
	textToVideoPath  = "/api/v1/veo_3_1/text_to_video"
	extendVideoPath  = "/api/v1/veo_3_1/extend_video"
	upscaleVideoPath = "/api/v1/veo_3_1/upscale_video"
)

// Client is the Veo 3.1 video API client.
type Client struct {
	// TextToVideo provides text, image, and reference-to-video operations.
	TextToVideo *TextToVideo
	// ExtendVideo provides video extension operations.
	ExtendVideo *ExtendVideo
	// UpscaleVideo provides resolution upscaling operations.
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
		TextToVideo:  &TextToVideo{http: httpClient},
		ExtendVideo:  &ExtendVideo{http: httpClient},
		UpscaleVideo: &UpscaleVideo{http: httpClient},
	}
}

// TextToVideo creates videos from prompts, images, or references.
type TextToVideo struct{ http core.HTTPClient }

// ExtendVideo extends existing videos with additional content.
type ExtendVideo struct{ http core.HTTPClient }

// UpscaleVideo upscales videos to the requested target resolution.
type UpscaleVideo struct{ http core.HTTPClient }

func (r *TextToVideo) Create(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToVideoPath, core.CompactParams(params), requestOptions)
}
func (r *TextToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[TextToVideoResponse](ctx, r.http, core.ResourcePath(textToVideoPath, id), requestOptions)
}
func (r *TextToVideo) Run(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*TextToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

func (r *ExtendVideo) Create(ctx context.Context, params ExtendVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, extendVideoPath, core.CompactParams(params), requestOptions)
}
func (r *ExtendVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*ExtendVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[ExtendVideoResponse](ctx, r.http, core.ResourcePath(extendVideoPath, id), requestOptions)
}
func (r *ExtendVideo) Run(ctx context.Context, params ExtendVideoParams, opts ...option.RequestOption) (*ExtendVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*ExtendVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

func (r *UpscaleVideo) Create(ctx context.Context, params UpscaleVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, upscaleVideoPath, core.CompactParams(params), requestOptions)
}
func (r *UpscaleVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*UpscaleVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[UpscaleVideoResponse](ctx, r.http, core.ResourcePath(upscaleVideoPath, id), requestOptions)
}
func (r *UpscaleVideo) Run(ctx context.Context, params UpscaleVideoParams, opts ...option.RequestOption) (*UpscaleVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*UpscaleVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}
