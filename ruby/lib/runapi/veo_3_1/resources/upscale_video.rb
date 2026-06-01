# frozen_string_literal: true

module RunApi
  module Veo31
    module Resources
      # Veo 3.1 videos upscaling resource.
      class UpscaleVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/veo_3_1/upscale_video"

        RESPONSE_CLASS = Types::UpscaleVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedUpscaleVideoResponse

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
          raise Core::ValidationError, "source_task_id is required" unless params[:source_task_id] || params["source_task_id"]
          output_resolution = params[:output_resolution] || params["output_resolution"]
          unless Types::OUTPUT_RESOLUTIONS.include?(output_resolution)
            raise Core::ValidationError, "output_resolution must be one of: #{Types::OUTPUT_RESOLUTIONS.join(", ")}"
          end
        end
      end
    end
  end
end
