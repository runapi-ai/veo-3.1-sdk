# frozen_string_literal: true

module RunApi
  module Veo31
    module Types
      MODELS = %w[veo-3.1 veo-3.1-fast].freeze
      TARGET_RESOLUTIONS = %w[1080p 4k].freeze
      GENERATION_TYPES = %w[TEXT_2_VIDEO FIRST_AND_LAST_FRAMES_2_VIDEO REFERENCE_2_VIDEO].freeze
      ASPECT_RATIOS = %w[16:9 9:16 auto].freeze

      class Video < RunApi::Core::BaseModel
        optional :url, String
        optional :resolution, String
        optional :has_audio
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToVideoResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :video, -> { Video }
      end

      class ExtendVideoResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :video, -> { Video }
      end

      class UpscaleVideoResponse < AsyncTaskResponse
        optional :video, -> { Video }
      end

      class CompletedTextToVideoResponse < TextToVideoResponse
        required :videos, [ -> { Video } ]
      end

      class CompletedExtendVideoResponse < ExtendVideoResponse
        required :videos, [ -> { Video } ]
      end

      class CompletedUpscaleVideoResponse < UpscaleVideoResponse
        required :video, -> { Video }
      end
    end
  end
end
