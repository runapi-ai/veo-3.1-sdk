# frozen_string_literal: true

module RunApi
  module Veo31
    module Resources
      # Veo 3.1 video extension resource.
      class ExtendVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/veo_3_1/extend_video"

        RESPONSE_CLASS = Types::ExtendVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedExtendVideoResponse

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
          raise Core::ValidationError, "prompt is required" unless params[:prompt] || params["prompt"]
        end
      end
    end
  end
end
