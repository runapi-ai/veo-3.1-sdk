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
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Prompt: "a sunset",
		Model:  ModelVeo31,
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
}

func TestExtendVideoCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ExtendVideo.Create(context.Background(), ExtendVideoParams{
		TaskID: "task_orig",
		Prompt: "extend it",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/veo_3_1/extend_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestUpscaleVideoCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.UpscaleVideo.Create(context.Background(), UpscaleVideoParams{
		TaskID:           "task_orig",
		TargetResolution: TargetResolution4K,
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/veo_3_1/upscale_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["target_resolution"] != string(TargetResolution4K) {
		t.Fatalf("unexpected target_resolution: %v", body["target_resolution"])
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
