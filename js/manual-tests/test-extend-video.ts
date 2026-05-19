import { Veo31Client } from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 Video Extension\n');
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
    console.log('\n📤 Step 1: Generate original video');
    console.log('-'.repeat(50));
    const originalVideo = await client.textToVideo.run({
      prompt: 'A dog playing with a ball in a park',
      model: 'veo-3.1-fast',
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Original video generated!');
    console.log(`   Task ID: ${originalVideo.id}`);
    console.log(`   Status: ${originalVideo.status}`);
    
    if (originalVideo.videos && originalVideo.videos.length > 0) {
      console.log(`   Video URL: ${originalVideo.videos[0].url}`);
    }

    console.log('\n📤 Step 2: Create video extension (create method)');
    console.log('-'.repeat(50));
    const extCreateResult = await client.extendVideo.create({
      task_id: originalVideo.id,
      prompt: 'The dog catches the ball and runs back excitedly',
      seeds: 12345,
      watermark: 'Test',
    });
    
    console.log('✅ Extension task created!');
    console.log(`   Extension ID: ${extCreateResult.id}`);

    console.log('\n🔍 Step 3: Check extension status (get method)');
    console.log('-'.repeat(50));
    const extGetResult = await client.extendVideo.get(extCreateResult.id);
    
    console.log('✅ Extension status retrieved!');
    console.log(`   Extension ID: ${extGetResult.id}`);
    console.log(`   Status: ${extGetResult.status}`);
    console.log(`   Original Task ID: ${extGetResult.original_task_id}`);

    console.log('\n⏳ Step 4: Complete extension workflow (run method)');
    console.log('-'.repeat(50));
    console.log('   This will extend the video and wait for completion...');
    
    const extRunResult = await client.extendVideo.run({
      task_id: originalVideo.id,
      prompt: 'The dog continues playing and jumps with joy',
    });
    
    console.log('✅ Extension completed successfully!');
    console.log(`   Extension ID: ${extRunResult.id}`);
    console.log(`   Status: ${extRunResult.status}`);
    
    if (extRunResult.videos && extRunResult.videos.length > 0) {
      console.log(`   Extended video URLs:`);
      extRunResult.videos.forEach((video, idx) => {
        console.log(`     [${idx + 1}] ${video.url} (${video.resolution})`);
      });
    }

    console.log('\n🎉 All video extension tests passed!\n');
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
