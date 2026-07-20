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
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get text-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Veo31::Types::TextToVideoResponse] current task status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end

        private

        def validate_params!(params)
          validate_contract!(CONTRACT["text-to-video"], params)

          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)

          validate_input_mode!(params)
        end

        def validate_input_mode!(params)
          input_mode = param(params, :input_mode)
          return unless input_mode

          case input_mode
          when "first_and_last_frames"
            raise Core::ValidationError, "first_frame_image_url is required for first_and_last_frames" unless field_present?(params, :first_frame_image_url)
            if field_present?(params, :reference_image_urls)
              raise Core::ValidationError, "reference_image_urls requires input_mode reference"
            end
          when "reference"
            urls = param(params, :reference_image_urls)
            raise Core::ValidationError, "reference_image_urls is required for reference" unless urls
            model = param(params, :model)
            unless model == "veo-3.1-fast"
              raise Core::ValidationError, "reference requires model veo-3.1-fast"
            end
            ar = param(params, :aspect_ratio)
            if ar && ar != "16:9"
              raise Core::ValidationError, "reference requires aspect_ratio 16:9"
            end
            if field_present?(params, :first_frame_image_url) || field_present?(params, :last_frame_image_url)
              raise Core::ValidationError, "first_frame_image_url and last_frame_image_url require input_mode first_and_last_frames"
            end
          else
            if field_present?(params, :first_frame_image_url) || field_present?(params, :last_frame_image_url)
              raise Core::ValidationError, "first_frame_image_url and last_frame_image_url require input_mode first_and_last_frames"
            end
            if field_present?(params, :reference_image_urls)
              raise Core::ValidationError, "reference_image_urls requires input_mode reference"
            end
          end
        end
      end
    end
  end
end
