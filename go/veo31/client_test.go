package veo31

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/runapi-ai/core-sdk/go/core"
)

type stubHTTPClient struct {
	method string
	path   string
	body   any
}

func (s *stubHTTPClient) Request(_ context.Context, method, path string, opts *core.HTTPRequestOptions) (json.RawMessage, error) {
	s.method = method
	s.path = path
	if opts != nil {
		s.body = opts.Body
	}
	return json.RawMessage(`{"id":"task_123","status":"processing"}`), nil
}

func TestTextToVideoCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	duration := 6
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Prompt:          "a sunset",
		Model:           ModelVeo31,
		InputMode:       InputMode("text"),
		DurationSeconds: &duration,
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/veo_3_1/text_to_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["prompt"] != "a sunset" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
	if body["model"] != string(ModelVeo31) {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["duration_seconds"] != float64(6) && body["duration_seconds"] != 6 {
		t.Fatalf("unexpected duration_seconds: %v", body["duration_seconds"])
	}
	if body["input_mode"] != "text" {
		t.Fatalf("unexpected input_mode: %v", body["input_mode"])
	}
	if _, ok := body["generation_type"]; ok {
		t.Fatal("expected generation_type to be absent")
	}
}

func TestTextToVideoCreateWithFrameInputs(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Prompt:             "a dog starts running",
		Model:              ModelVeo31Fast,
		InputMode:          InputMode("first_and_last_frames"),
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/first-frame.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/last-frame.jpg",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["first_frame_image_url"] != "https://cdn.runapi.ai/public/samples/first-frame.jpg" {
		t.Fatalf("unexpected first_frame_image_url: %v", body["first_frame_image_url"])
	}
	if body["last_frame_image_url"] != "https://cdn.runapi.ai/public/samples/last-frame.jpg" {
		t.Fatalf("unexpected last_frame_image_url: %v", body["last_frame_image_url"])
	}
	if _, ok := body["image_urls"]; ok {
		t.Fatalf("unexpected image_urls key in body: %#v", body)
	}
}

func TestTextToVideoCreateRejectsEmptyReferenceImages(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Prompt:             "a dog starts running",
		Model:              ModelVeo31,
		InputMode:          InputMode("reference"),
		ReferenceImageURLs: []string{},
	})
	if err == nil || err.Error() != "reference_image_urls must contain between 1 and 3 items" {
		t.Fatalf("expected item-count validation error, got %v", err)
	}
	if stub.method != "" {
		t.Fatalf("expected validation before HTTP request, got %s %s", stub.method, stub.path)
	}
}

func TestExtendVideoCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ExtendVideo.Create(context.Background(), ExtendVideoParams{
		SourceTaskID: "task_orig",
		Prompt:       "extend it",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/veo_3_1/extend_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["source_task_id"] != "task_orig" {
		t.Fatalf("unexpected source_task_id: %v", body["source_task_id"])
	}
	if _, ok := body["task_id"]; ok {
		t.Fatalf("unexpected task_id: %#v", body)
	}
}

func TestUpscaleVideoCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.UpscaleVideo.Create(context.Background(), UpscaleVideoParams{
		SourceTaskID:     "task_orig",
		OutputResolution: OutputResolution4K,
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/veo_3_1/upscale_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["output_resolution"] != string(OutputResolution4K) {
		t.Fatalf("unexpected output_resolution: %v", body["output_resolution"])
	}
}

func TestTextToVideoGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Get(context.Background(), "task_abc")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/veo_3_1/text_to_video/task_abc" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestExtendVideoGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ExtendVideo.Get(context.Background(), "task_ext")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/veo_3_1/extend_video/task_ext" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestUpscaleVideoGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.UpscaleVideo.Get(context.Background(), "task_upscale")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/veo_3_1/upscale_video/task_upscale" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestTextToVideoCreateCompactsParams(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Prompt: "a sunset",
		Model:  ModelVeo31,
		// CallbackURL is empty, should be compacted.
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
}
