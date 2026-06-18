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
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create a text-to-video task without waiting.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Veo31::Types::TextToVideoResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get text-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Veo31::Types::TextToVideoResponse] current task status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          raise Core::ValidationError, "model is required" unless param(params, :model)
          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)

          model = param(params, :model)
          unless Types::MODELS.include?(model)
            raise Core::ValidationError, "Invalid model: #{model}. Must be one of: #{Types::MODELS.join(", ")}"
          end

          validate_optional!(params, :aspect_ratio, Types::ASPECT_RATIOS)
          validate_optional!(params, :input_mode, Types::INPUT_MODES)
          validate_duration!(params)

          validate_input_mode!(params)
        end

        def validate_duration!(params)
          duration_seconds = param(params, :duration_seconds)
          return unless duration_seconds
          return if Types::DURATIONS.include?(duration_seconds)

          raise Core::ValidationError, "Invalid duration_seconds: #{duration_seconds}. Must be one of: #{Types::DURATIONS.join(", ")}"
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
            unless urls.is_a?(Array) && urls.length.between?(1, 3)
              raise Core::ValidationError, "reference_image_urls must contain 1-3 items for reference"
            end
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

        def field_present?(params, key)
          value = param(params, key)
          value.is_a?(Array) ? value.any? : !value.nil? && !value.to_s.empty?
        end
      end
    end
  end
end
