import { Veo31Client } from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 Reference-to-Video Generation\n');
  console.log('='.repeat(50));

  const apiKey = process.env.RUNAPI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: RUNAPI_API_KEY environment variable is required');
    process.exit(1);
  }

  const testImageUrl = process.env.TEST_IMAGE_URL;
  if (!testImageUrl) {
    console.error('❌ Error: TEST_IMAGE_URL environment variable is required');
    process.exit(1);
  }

  const client = new Veo31Client({
    apiKey,
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    console.log('\n📤 Test 1: Reference-based generation with 1 image (create method)');
    console.log('-'.repeat(50));
    console.log('   Note: REFERENCE_2_VIDEO only supports veo-3.1-fast and 16:9');
    
    const createResult = await client.textToVideo.create({
      prompt: 'A person walking through a modern office environment',
      model: 'veo-3.1-fast',
      generation_type: 'REFERENCE_2_VIDEO',
      image_urls: [testImageUrl],
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

    console.log('\n⏳ Test 3: Reference-based generation with 2 images');
    console.log('-'.repeat(50));
    console.log('   Using 2 reference images for style guidance...');
    
    const runResult = await client.textToVideo.run({
      prompt: 'A dynamic scene with modern architecture and people',
      model: 'veo-3.1-fast',
      generation_type: 'REFERENCE_2_VIDEO',
      image_urls: [
        testImageUrl,
        testImageUrl,
      ],
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Generation completed successfully!');
    console.log(`   Task ID: ${runResult.id}`);
    console.log(`   Status: ${runResult.status}`);
    
    if (runResult.videos && runResult.videos.length > 0) {
      console.log(`   Video URLs:`);
      runResult.videos.forEach((video, idx) => {
        console.log(`     [${idx + 1}] ${video.url} (${video.resolution})`);
      });
    }

    console.log('\n⏳ Test 4: Reference-based generation with 3 images (maximum)');
    console.log('-'.repeat(50));
    console.log('   Using 3 reference images for comprehensive style guidance...');
    
    const maxRefResult = await client.textToVideo.run({
      prompt: 'A cinematic scene inspired by the reference images',
      model: 'veo-3.1-fast',
      generation_type: 'REFERENCE_2_VIDEO',
      image_urls: [
        testImageUrl,
        testImageUrl,
        testImageUrl,
      ],
      aspect_ratio: '16:9',
    });
    
    console.log('✅ Generation with 3 references completed!');
    console.log(`   Task ID: ${maxRefResult.id}`);
    console.log(`   Status: ${maxRefResult.status}`);
    
    if (maxRefResult.videos && maxRefResult.videos.length > 0) {
      console.log(`   Video URLs:`);
      maxRefResult.videos.forEach((video, idx) => {
        console.log(`     [${idx + 1}] ${video.url}`);
      });
    }

    console.log('\n📋 REFERENCE_2_VIDEO Constraints:');
    console.log('='.repeat(50));
    console.log('✅ Model: Only veo-3.1-fast supported');
    console.log('✅ Aspect Ratio: Only 16:9 supported');
    console.log('✅ Image Count: 1-3 reference images');
    console.log('✅ Use Case: Style-guided video generation');

    console.log('\n🎉 All reference-to-video tests passed!\n');
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('='.repeat(50));
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      
      if (error.message.includes('aspect_ratio') || error.message.includes('model')) {
        console.error('\n💡 Reminder: REFERENCE_2_VIDEO only supports:');
        console.error('   - Model: veo-3.1-fast (not veo-3.1)');
        console.error('   - Aspect Ratio: 16:9 (not 9:16 or Auto)');
      }
    } else {
      console.error('Unknown error:', error);
    }
    
    process.exit(1);
  }
}

main();
