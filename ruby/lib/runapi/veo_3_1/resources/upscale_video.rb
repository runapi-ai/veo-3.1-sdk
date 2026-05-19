# frozen_string_literal: true

module RunApi
  module Veo31
    module Resources
      # Veo 3.1 video upscaling resource.
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
          raise Core::ValidationError, "task_id is required" unless params[:task_id] || params["task_id"]
          resolution = params[:target_resolution] || params["target_resolution"]
          unless Types::TARGET_RESOLUTIONS.include?(resolution)
            raise Core::ValidationError, "target_resolution must be one of: #{Types::TARGET_RESOLUTIONS.join(", ")}"
          end
        end
      end
    end
  end
end
