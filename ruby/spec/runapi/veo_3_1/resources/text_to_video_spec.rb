# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Veo31::Resources::TextToVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:text_to_video) { described_class.new(http) }
  let(:endpoint) { "/api/v1/veo_3_1/text_to_video" }

  describe "#create" do
    it "POSTs to the correct endpoint with params" do
      params = {model: "veo-3.1-fast", prompt: "a dog in a park"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-1")

      result = text_to_video.create(**params)
      expect(result).to be_a(RunApi::Veo31::Types::TextToVideoResponse)
      expect(result.id).to eq("task-1")
      expect(result["id"]).to eq("task-1")
    end

    it "passes valid optional params" do
      params = {model: "veo-3.1-fast", prompt: "test", aspect_ratio: "16:9", duration_seconds: 6, input_mode: "text"}
      expect(http).to receive(:request).with(:post, endpoint, body: params).and_return("id" => "t1")
      text_to_video.create(**params)
    end
  end

  it "accepts a Lite reference request" do
    params = {
      model: "veo-3.1-lite",
      prompt: "Keep the subject and composition",
      input_mode: "reference",
      aspect_ratio: "16:9",
      duration_seconds: 8,
      reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"]
    }
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "lite-1", "status" => "processing")

    text_to_video.create(**params)
  end

  describe "frame and reference input mode validation" do
    let(:base) { {model: "veo-3.1-fast", prompt: "test", input_mode: "reference", aspect_ratio: "16:9"} }

    it "passes first and last frame params" do
      params = {
        model: "veo-3.1-fast",
        prompt: "test",
        input_mode: "first_and_last_frames",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/first-frame.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params).and_return("id" => "t1")
      text_to_video.create(**params)
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return(
          "id" => "task-1",
          "status" => "completed",
          "videos" => [
            {
              "url" => "https://cdn.runapi.ai/public/samples/source.mp4",
              "resolution" => "1080p",
              "has_audio" => true
            }
          ],
          "sources" => [
            {"url" => "https://cdn.runapi.ai/public/samples/source.mp4"}
          ]
        )

      result = text_to_video.get("task-1")
      expect(result).to be_a(RunApi::Veo31::Types::TextToVideoResponse)
      expect(result.status).to eq("completed")
      expect(result.videos.first.url).to eq("https://cdn.runapi.ai/public/samples/source.mp4")
      expect(result.sources.first.url).to eq("https://cdn.runapi.ai/public/samples/source.mp4")
      expect(result).not_to respond_to(:video)
    end
  end
end
