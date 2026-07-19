# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Veo31::Client do
  after { RunApi.api_key = nil }

  it "accepts api_key as parameter" do
    client = described_class.new(api_key: "param-key")
    expect(client).to be_a(described_class)
  end

  it "falls back to global RunApi.api_key" do
    RunApi.api_key = "global-key"
    client = described_class.new
    expect(client).to be_a(described_class)
  end

  it "raises AuthenticationError without api_key" do
    expect { described_class.new }.to raise_error(RunApi::Core::AuthenticationError, /API key is required/)
  end

  context "with custom http_client" do
    it "uses the provided http_client" do
      custom_http = double("custom_http")
      client = described_class.new(api_key: "test-key", http_client: custom_http)
      expect(client.text_to_video.instance_variable_get(:@http)).to eq(custom_http)
    end

    it "falls back to Core::HttpClient when http_client is nil" do
      client = described_class.new(api_key: "test-key")
      expect(client.text_to_video.instance_variable_get(:@http)).to be_a(RunApi::Core::HttpClient)
    end
  end

  context "with valid api_key" do
    let(:client) { described_class.new(api_key: "test-key") }

    it "exposes text_to_video resource" do
      expect(client.text_to_video).to be_a(RunApi::Veo31::Resources::TextToVideo)
    end

    it "exposes extend_video resource" do
      expect(client.extend_video).to be_a(RunApi::Veo31::Resources::ExtendVideo)
    end

    it "exposes upscale_video resource" do
      expect(client.upscale_video).to be_a(RunApi::Veo31::Resources::UpscaleVideo)
    end
  end
end
