# frozen_string_literal: true

module RunApi
  module Veo31
    module Types
      MODELS = %w[veo-3.1 veo-3.1-fast].freeze
      OUTPUT_RESOLUTIONS = %w[1080p 4k].freeze
      INPUT_MODES = %w[text first_and_last_frames reference].freeze
      ASPECT_RATIOS = %w[16:9 9:16 auto].freeze
      DURATIONS = [4, 6, 8].freeze

      class Video < RunApi::Core::BaseModel
        optional :url, String
        optional :resolution, String
        optional :has_audio
      end

      class Source < RunApi::Core::BaseModel
        optional :url, String
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToVideoResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :sources, [-> { Source }]
      end

      class ExtendVideoResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :sources, [-> { Source }]
      end

      class UpscaleVideoResponse < AsyncTaskResponse
        optional :source_task_id, String
        optional :videos, [-> { Video }]
        optional :sources, [-> { Source }]
        optional :media_ids, [String]
      end

      class CompletedTextToVideoResponse < TextToVideoResponse
        required :videos, [-> { Video }]
      end

      class CompletedExtendVideoResponse < ExtendVideoResponse
        required :videos, [-> { Video }]
      end

      class CompletedUpscaleVideoResponse < UpscaleVideoResponse
        required :videos, [-> { Video }]
      end
    end
  end
end
