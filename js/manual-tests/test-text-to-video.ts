import { Veo31Client } from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 Text-to-Video Generation\n');
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
    console.log('\n📤 Test 1: Creating text-to-video task (create method)');
    console.log('-'.repeat(50));
    const createResult = await client.textToVideo.create({
      prompt: 'A dog playing in a park on a sunny day',
      model: 'veo-3.1-fast',
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Task created successfully!');
    console.log(`   Task ID: ${createResult.id}`);

    console.log('\n🔍 Test 2: Checking task status (get method)');
    console.log('-'.repeat(50));
    const getResult = await client.textToVideo.get(createResult.id);
    
    console.log('✅ Status retrieved successfully!');
    console.log(`   Task ID: ${getResult.id}`);
    console.log(`   Status: ${getResult.status}`);
    
    if (getResult.videos && getResult.videos.length > 0) {
      console.log(`   Video URLs: ${getResult.videos.map(v => v.url).join(', ')}`);
    }

    console.log('\n⏳ Test 3: Running complete workflow (run method)');
    console.log('-'.repeat(50));
    console.log('   This will create a new task and wait for completion...');
    
    const runResult = await client.textToVideo.run({
      prompt: 'A serene lake with crystal clear water',
      model: 'veo-3.1-fast',
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Generation completed successfully!');
    console.log(`   Task ID: ${runResult.id}`);
    console.log(`   Status: ${runResult.status}`);
    
    if (runResult.videos && runResult.videos.length > 0) {
      console.log(`   Video URLs:`);
      runResult.videos.forEach((video, idx) => {
        console.log(`     [${idx + 1}] ${video.url}`);
      });
    }

    console.log('\n🎉 All tests passed!\n');
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
