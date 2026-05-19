# frozen_string_literal: true

module RunApi
  module Veo31
    module Resources
      # Veo 3.1 text-to-video resource.
      class TextToVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/veo_3_1/text_to_video"

        RESPONSE_CLASS = Types::TextToVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedTextToVideoResponse

        def initialize(http)
          @http = http
        end

        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

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
          validate_optional!(params, :generation_type, Types::GENERATION_TYPES)

          validate_generation_type!(params)
        end

        def validate_generation_type!(params)
          gen_type = param(params, :generation_type)
          return unless gen_type

          case gen_type
          when "FIRST_AND_LAST_FRAMES_2_VIDEO"
            urls = param(params, :image_urls)
            raise Core::ValidationError, "image_urls is required for FIRST_AND_LAST_FRAMES_2_VIDEO" unless urls
            unless urls.is_a?(Array) && urls.length.between?(1, 2)
              raise Core::ValidationError, "image_urls must contain 1-2 items for FIRST_AND_LAST_FRAMES_2_VIDEO"
            end
          when "REFERENCE_2_VIDEO"
            urls = param(params, :image_urls)
            raise Core::ValidationError, "image_urls is required for REFERENCE_2_VIDEO" unless urls
            unless urls.is_a?(Array) && urls.length.between?(1, 3)
              raise Core::ValidationError, "image_urls must contain 1-3 items for REFERENCE_2_VIDEO"
            end
            model = param(params, :model)
            unless model == "veo-3.1-fast"
              raise Core::ValidationError, "REFERENCE_2_VIDEO requires model veo-3.1-fast"
            end
            ar = param(params, :aspect_ratio)
            if ar && ar != "16:9"
              raise Core::ValidationError, "REFERENCE_2_VIDEO requires aspect_ratio 16:9"
            end
          end
        end
      end
    end
  end
end
