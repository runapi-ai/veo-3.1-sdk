#!/usr/bin/env ruby
# frozen_string_literal: true

require "bundler/setup"
require "runapi/veo_3_1"

client = RunApi::Veo31::Client.new(
  api_key: ENV.fetch("RUNAPI_API_KEY", "runapi_test_token"),
  base_url: ENV.fetch("RUNAPI_BASE_URL", "http://localhost:3000")
)

# 1. Text-to-video generation
puts "=== Text-to-Video Generation ==="
result = client.text_to_video.run(
  model: "veo-3.1-fast",
  prompt: "A serene mountain lake at sunset with golden reflections",
  aspect_ratio: "16:9"
)
puts "Status: #{result["status"]}"
result["videos"]&.each_with_index do |video, i|
  puts "  Video #{i + 1}: #{video["url"]}"
end

# 2. Image-to-video (first and last frames)
puts "\n=== Image-to-Video (First & Last Frames) ==="
result = client.text_to_video.run(
  model: "veo-3.1-fast",
  prompt: "The dog starts running energetically across the field",
  input_mode: "first_and_last_frames",
  first_frame_image_url: ENV.fetch("TEST_IMAGE_URL", "https://raw.githubusercontent.com/ckenst/images-catalog/refs/heads/master/size/small_size/Starbucks%20Dog.jpg"),
  aspect_ratio: "16:9"
)
puts "Status: #{result["status"]}"
result["videos"]&.each_with_index do |video, i|
  puts "  Video #{i + 1}: #{video["url"]}"
end

# 3. Video extension
puts "\n=== Video Extension ==="
result = client.extend_video.run(
  source_task_id: result["id"] || raise("No task id from previous step - cannot extend"),
  prompt: "Continue the scene with the dog jumping into a lake"
)
puts "Status: #{result["status"]}"
result["videos"]&.each_with_index do |video, i|
  puts "  Video #{i + 1}: #{video["url"]}"
end

# 4. 1080p upscale
puts "\n=== 1080p Upscale ==="
result = client.upscale_video.run(
  source_task_id: result["id"] || raise("No task id from previous step - cannot upscale"),
  output_resolution: "1080p"
)
puts "Status: #{result["status"]}"
result["videos"]&.each_with_index do |video, i|
  puts "  Video #{i + 1}: #{video["url"]}"
end

# 5. Manual polling (create + get)
puts "\n=== Manual Polling ==="
task = client.text_to_video.create(
  model: "veo-3.1-fast",
  prompt: "A golden retriever in a field"
)
raise "Failed to create task" unless task["id"]
puts "Task ID: #{task["id"]}"

loop do
  status = client.text_to_video.get(task["id"])
  puts "Polling... status=#{status["status"]}"
  break if status["status"] == "completed" || status["status"] == "failed"

  sleep 2
end

# 6. Error handling
puts "\n=== Error Handling ==="
begin
  client.text_to_video.create(model: "invalid-model", prompt: "test")
rescue RunApi::Core::ValidationError => e
  puts "Caught ValidationError: #{e.message}"
end

begin
  client.text_to_video.create(prompt: "missing model")
rescue RunApi::Core::ValidationError => e
  puts "Caught ValidationError: #{e.message}"
end
