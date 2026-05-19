import { Veo31Client } from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 Quality vs Fast Models\n');
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
    const prompt = 'A serene lake with crystal clear water reflecting mountains';

    console.log('\n⚡ Test 1: Fast Model (veo-3.1-fast - 50 credits)');
    console.log('-'.repeat(50));
    const startFast = Date.now();
    
    const fastResult = await client.textToVideo.run({
      prompt,
      model: 'veo-3.1-fast',
      aspect_ratio: '16:9',
    });
    
    const fastTime = Date.now() - startFast;
    console.log('✅ Fast model completed!');
    console.log(`   Task ID: ${fastResult.id}`);
    console.log(`   Time: ${(fastTime / 1000).toFixed(1)}s`);
    
    if (fastResult.videos && fastResult.videos.length > 0) {
      console.log(`   Resolution: ${fastResult.videos[0].resolution}`);
      console.log(`   URL: ${fastResult.videos[0].url}`);
    }

    console.log('\n🎨 Test 2: Quality Model (veo-3.1 - 100 credits)');
    console.log('-'.repeat(50));
    const startQuality = Date.now();
    
    const qualityResult = await client.textToVideo.run({
      prompt,
      model: 'veo-3.1',
      aspect_ratio: '16:9',
    });
    
    const qualityTime = Date.now() - startQuality;
    console.log('✅ Quality model completed!');
    console.log(`   Task ID: ${qualityResult.id}`);
    console.log(`   Time: ${(qualityTime / 1000).toFixed(1)}s`);
    
    if (qualityResult.videos && qualityResult.videos.length > 0) {
      console.log(`   Resolution: ${qualityResult.videos[0].resolution}`);
      console.log(`   URL: ${qualityResult.videos[0].url}`);
    }

    console.log('\n📊 Comparison Summary:');
    console.log('='.repeat(50));
    console.log(`Fast Model (veo-3.1-fast):`);
    console.log(`  - Time: ${(fastTime / 1000).toFixed(1)}s`);
    console.log(`  - Credits: 50`);
    console.log(`  - Use case: Cost-efficient, rapid iteration`);
    console.log('');
    console.log(`Quality Model (veo-3.1):`);
    console.log(`  - Time: ${(qualityTime / 1000).toFixed(1)}s`);
    console.log(`  - Credits: 100`);
    console.log(`  - Use case: Highest fidelity, production output`);

    console.log('\n🎉 All model comparison tests passed!\n');
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
