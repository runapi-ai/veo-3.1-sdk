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

    it "raises ValidationError when model is missing" do
      expect { text_to_video.create(prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /model must be one of: veo-3\.1, veo-3\.1-fast/)
    end

    it "raises ValidationError when prompt is missing" do
      expect { text_to_video.create(model: "veo-3.1") }
        .to raise_error(RunApi::Core::ValidationError, /prompt is required/)
    end

    it "raises ValidationError for invalid model" do
      expect { text_to_video.create(model: "invalid", prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /model must be one of: veo-3\.1, veo-3\.1-fast/)
    end

    it "passes valid optional params" do
      params = {model: "veo-3.1-fast", prompt: "test", aspect_ratio: "16:9", duration_seconds: 6, input_mode: "text"}
      expect(http).to receive(:request).with(:post, endpoint, body: params).and_return("id" => "t1")
      text_to_video.create(**params)
    end

    it "raises ValidationError for invalid duration_seconds" do
      expect { text_to_video.create(model: "veo-3.1-fast", prompt: "test", duration_seconds: 5) }
        .to raise_error(RunApi::Core::ValidationError, /duration_seconds must be one of: 4, 6, 8/)
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

  it "rejects a non-eight-second Lite reference request" do
    expect {
      text_to_video.create(
        model: "veo-3.1-lite",
        prompt: "Keep the subject and composition",
        input_mode: "reference",
        duration_seconds: 4,
        reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"]
      )
    }.to raise_error(RunApi::Core::ValidationError, /duration_seconds/)
  end

  describe "frame and reference input mode validation" do
    let(:base) { {model: "veo-3.1-fast", prompt: "test", input_mode: "reference", aspect_ratio: "16:9"} }

    it "requires reference_image_urls" do
      expect { text_to_video.create(**base) }
        .to raise_error(RunApi::Core::ValidationError, /reference_image_urls is required/)
    end

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

    it "requires the fast or Lite model" do
      expect { text_to_video.create(model: "veo-3.1", prompt: "test", input_mode: "reference", reference_image_urls: ["a"]) }
        .to raise_error(RunApi::Core::ValidationError, /requires model veo-3.1-fast or veo-3.1-lite/)
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
