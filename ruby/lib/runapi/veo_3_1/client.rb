# frozen_string_literal: true

module RunApi
  module Veo31
    # Veo 3.1 video API client.
    #
    # @example
    #   client = RunApi::Veo31::Client.new(api_key: "your-api-key")
    #   result = client.text_to_video.run(
    #     model: "veo-3.1-fast", prompt: "A drone shot over mountains at sunset"
    #   )
    class Client
      # @return [Resources::TextToVideo] Text, image, and reference-to-video operations.
      # @return [Resources::ExtendVideo] Video extension operations.
      # @return [Resources::UpscaleVideo] Video upscaling operations.
      attr_reader :text_to_video, :extend_video, :upscale_video

      def initialize(api_key: nil, **options)
        @api_key = Core::Auth.resolve_api_key(api_key)

        client_options = Core::ClientOptions.new(api_key: @api_key, **options)
        http = client_options.http_client || Core::HttpClient.new(client_options)
        @text_to_video = Resources::TextToVideo.new(http)
        @extend_video = Resources::ExtendVideo.new(http)
        @upscale_video = Resources::UpscaleVideo.new(http)
      end
    end
  end
end
