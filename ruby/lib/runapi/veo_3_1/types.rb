# frozen_string_literal: true

module RunApi
  module Veo31
    # Type definitions and constants for Veo 3.1 video generation.
    module Types
      # Model variants: veo-3.1 (full quality, higher fidelity) and veo-3.1-fast (low latency).
      MODELS = %w[veo-3.1 veo-3.1-fast].freeze

      # Upscale target resolutions: 1080p (1920x1080) or 4k (3840x2160, higher detail and cost).
      OUTPUT_RESOLUTIONS = %w[1080p 4k].freeze

      # Generation input modes: text (default), first_and_last_frames (frame images),
      # or reference (1-3 reference images, fast model only, 16:9 only).
      INPUT_MODES = %w[text first_and_last_frames reference].freeze

      # Video aspect ratios: 16:9 landscape, 9:16 portrait, auto (crop based on input dimensions).
      ASPECT_RATIOS = %w[16:9 9:16 auto].freeze

      # Allowed video durations in seconds.
      DURATIONS = [4, 6, 8].freeze

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
