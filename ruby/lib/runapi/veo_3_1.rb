# frozen_string_literal: true

require "runapi/core"
require_relative "veo_3_1/types"
require_relative "veo_3_1/contract_gen"
require_relative "veo_3_1/resources/text_to_video"
require_relative "veo_3_1/resources/extend_video"
require_relative "veo_3_1/resources/upscale_video"
require_relative "veo_3_1/client"

module RunApi
  module Veo31
    AuthenticationError = RunApi::Core::AuthenticationError
    RateLimitError = RunApi::Core::RateLimitError
    InsufficientCreditsError = RunApi::Core::InsufficientCreditsError
    NotFoundError = RunApi::Core::NotFoundError
    ValidationError = RunApi::Core::ValidationError
    TaskFailedError = RunApi::Core::TaskFailedError
    TaskTimeoutError = RunApi::Core::TaskTimeoutError
  end
end
