# frozen_string_literal: true

module RunApi
  module Veo31
    # Type definitions and constants for Veo 3.1 video generation.
    module Types
      # Upscale target resolutions: 1080p (1920x1080) or 4k (3840x2160, higher detail and cost).
      OUTPUT_RESOLUTIONS = %w[1080p 4k].freeze

      # A generated video with its download URL and metadata.
      class Video < RunApi::Core::BaseModel
        optional :url, String
        optional :resolution, String
        optional :has_audio
      end

      # An input source (original image or video) referenced by the task.
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

      # Upscale task response. Includes the source task reference and optional media identifiers.
      class UpscaleVideoResponse < AsyncTaskResponse
        optional :source_task_id, String
        optional :videos, [-> { Video }]
        optional :sources, [-> { Source }]
        optional :media_ids, [String]
      end

      # Narrowed responses returned by +run()+ methods once polling observes
      # +status: "completed"+. +videos+ is required so consumers never have to
      # null-check it on a successful task.
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
