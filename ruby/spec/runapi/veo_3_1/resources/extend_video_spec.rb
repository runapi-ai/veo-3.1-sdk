# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Veo31::Resources::ExtendVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:extend_video) { described_class.new(http) }
  let(:endpoint) { "/api/v1/veo_3_1/extend_video" }

  describe "#create" do
    it "POSTs to the correct endpoint with params" do
      params = {source_task_id: "task-1", prompt: "extend the scene"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "ext-1")

      result = extend_video.create(**params)
      expect(result["id"]).to eq("ext-1")
    end

    it "raises ValidationError when source_task_id is missing" do
      expect { extend_video.create(prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /source_task_id is required/)
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/ext-1")
        .and_return(
          "id" => "ext-1",
          "status" => "completed",
          "videos" => [
            {
              "url" => "https://cdn.runapi.ai/public/samples/result.mp4",
              "resolution" => "1080p"
            }
          ],
          "sources" => [
            {"url" => "https://cdn.runapi.ai/public/samples/source.mp4"}
          ]
        )

      result = extend_video.get("ext-1")
      expect(result["status"]).to eq("completed")
      expect(result.videos.first.url).to eq("https://cdn.runapi.ai/public/samples/result.mp4")
      expect(result.sources.first.url).to eq("https://cdn.runapi.ai/public/samples/source.mp4")
      expect(result).not_to respond_to(:video)
    end
  end
end
