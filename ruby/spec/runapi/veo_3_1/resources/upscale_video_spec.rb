# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Veo31::Resources::UpscaleVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:upscale_video) { described_class.new(http) }
  let(:endpoint) { "/api/v1/veo_3_1/upscale_video" }

  describe "#create" do
    it "POSTs to the correct endpoint with params" do
      params = {source_task_id: "task-1", output_resolution: "4k"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "upscale-1")

      result = upscale_video.create(**params)
      expect(result["id"]).to eq("upscale-1")
    end

    it "raises ValidationError when source_task_id is missing" do
      expect { upscale_video.create(output_resolution: "1080p") }
        .to raise_error(RunApi::Core::ValidationError, /source_task_id is required/)
    end

    it "raises ValidationError when output_resolution is invalid" do
      expect { upscale_video.create(source_task_id: "task-1", output_resolution: "720p") }
        .to raise_error(RunApi::Core::ValidationError, /output_resolution/)
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/upscale-1")
        .and_return(
          "id" => "upscale-1",
          "status" => "completed",
          "source_task_id" => "task-1",
          "videos" => [
            {
              "url" => "https://cdn.runapi.ai/public/samples/result.mp4",
              "resolution" => "4k"
            }
          ],
          "sources" => [
            {"url" => "https://cdn.runapi.ai/public/samples/thumb.jpg"}
          ],
          "media_ids" => ["media-1"]
        )

      result = upscale_video.get("upscale-1")
      expect(result["status"]).to eq("completed")
      expect(result.source_task_id).to eq("task-1")
      expect(result.videos.first.url).to eq("https://cdn.runapi.ai/public/samples/result.mp4")
      expect(result.sources.first.url).to eq("https://cdn.runapi.ai/public/samples/thumb.jpg")
      expect(result.media_ids).to eq(["media-1"])
    end
  end
end
