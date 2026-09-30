# frozen_string_literal: true

module RunApi
  module Veo31
    module Resources
      # Veo 3.1 text-to-video resource.
      # Generate video from text, first/last frame images, or 1-3 reference images.
      class TextToVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/veo_3_1/text_to_video"

        RESPONSE_CLASS = Types::TextToVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedTextToVideoResponse

        def initialize(http)
          @http = http
        end

        # Generate a video and wait until complete.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Veo31::Types::CompletedTextToVideoResponse] completed task with videos
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create a text-to-video task without waiting.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Veo31::Types::TextToVideoResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get text-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Veo31::Types::TextToVideoResponse] current task status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end
      end
    end
  end
end
