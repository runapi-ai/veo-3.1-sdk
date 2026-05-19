import { Veo31Client } from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 1080p Video Upgrade\n');
  console.log('='.repeat(50));

  const apiKey = process.env.RUNAPI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: RUNAPI_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new Veo31Client({
    apiKey,
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    console.log('\n📤 Step 1: Generate video in 16:9 aspect ratio');
    console.log('-'.repeat(50));
    console.log('   Note: Only 16:9 videos support 1080p upgrade');
    
    const originalVideo = await client.textToVideo.run({
      prompt: 'A cinematic landscape with mountains and sunset',
      model: 'veo-3.1',
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Original video generated!');
    console.log(`   Task ID: ${originalVideo.id}`);
    console.log(`   Model: ${originalVideo.model}`);
    
    if (originalVideo.videos && originalVideo.videos.length > 0) {
      console.log(`   Original resolution: ${originalVideo.videos[0].resolution}`);
      console.log(`   Original URL: ${originalVideo.videos[0].url}`);
    }

    console.log('\n📤 Step 2: Request 1080p upgrade (create method)');
    console.log('-'.repeat(50));
    const upscaleCreateResult = await client.upscaleVideo.create({
      task_id: originalVideo.id,
      target_resolution: '1080p',
      index: 0,
    });
    
    console.log('✅ 1080p upgrade task created!');
    console.log(`   Upscale Task ID: ${upscaleCreateResult.id}`);

    console.log('\n🔍 Step 3: Check 1080p upgrade status (get method)');
    console.log('-'.repeat(50));
    const upscaleGetResult = await client.upscaleVideo.get(upscaleCreateResult.id);
    
    console.log('✅ 1080p status retrieved!');
    console.log(`   Upscale Task ID: ${upscaleGetResult.id}`);
    console.log(`   Status: ${upscaleGetResult.status}`);
    console.log(`   Original Task ID: ${upscaleGetResult.original_task_id}`);

    console.log('\n⏳ Step 4: Complete 1080p upgrade workflow (run method)');
    console.log('-'.repeat(50));
    console.log('   This will request 1080p and wait for completion...');
    
    const upscaleRunResult = await client.upscaleVideo.run({
      task_id: originalVideo.id,
      target_resolution: '1080p',
      index: 0,
    });
    
    console.log('✅ 1080p upgrade completed successfully!');
    console.log(`   Upscale Task ID: ${upscaleRunResult.id}`);
    console.log(`   Status: ${upscaleRunResult.status}`);
    
    if (upscaleRunResult.video) {
      console.log(`   1080p video:`);
      console.log(`     Resolution: ${upscaleRunResult.video.resolution}`);
      console.log(`     URL: ${upscaleRunResult.video.url}`);
    }

    console.log('\n🎉 All 1080p upgrade tests passed!\n');
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('='.repeat(50));
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
    
    process.exit(1);
  }
}

main();
