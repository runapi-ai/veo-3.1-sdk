import {
  Veo31Client,
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from '../src';

async function main() {
  console.log('🧪 Testing Veo 3.1 Error Handling\n');
  console.log('='.repeat(50));

  let passedTests = 0;
  let totalTests = 0;

  console.log('\n❌ Test 1: Missing API key');
  console.log('-'.repeat(50));
  totalTests++;
  try {
    new Veo31Client({ apiKey: '' });
    console.error('   FAILED: Should have thrown error');
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key is required')) {
      console.log('   ✅ PASSED: Correctly threw error for missing API key');
      passedTests++;
    } else {
      console.error('   FAILED: Wrong error thrown');
    }
  }

  console.log('\n❌ Test 2: Invalid API key (AuthenticationError)');
  console.log('-'.repeat(50));
  totalTests++;
  const invalidClient = new Veo31Client({
    apiKey: 'invalid-key-12345',
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });
  
  try {
    await invalidClient.textToVideo.create({
      prompt: 'Test',
      model: 'veo-3.1-fast',
    });
    console.error('   FAILED: Should have thrown AuthenticationError');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('   ✅ PASSED: Correctly threw AuthenticationError');
      console.log(`      Message: ${error.message}`);
      passedTests++;
    } else {
      console.error(`   FAILED: Wrong error type: ${error instanceof Error ? error.constructor.name : 'unknown'}`);
    }
  }

  const apiKey = process.env.RUNAPI_API_KEY;
  if (!apiKey) {
    console.log('\n⚠️  Skipping remaining tests: RUNAPI_API_KEY not set');
    console.log(`\nTests Passed: ${passedTests}/${totalTests}`);
    process.exit(0);
  }

  const client = new Veo31Client({
    apiKey,
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  console.log('\n❌ Test 3: Missing required parameters (ValidationError)');
  console.log('-'.repeat(50));
  totalTests++;
  try {
    await client.textToVideo.create({
      prompt: '',
      model: 'veo-3.1-fast',
    } as any);
    console.error('   FAILED: Should have thrown ValidationError');
  } catch (error) {
    if (error instanceof ValidationError || (error instanceof Error && error.message.includes('prompt'))) {
      console.log('   ✅ PASSED: Correctly threw error for invalid parameters');
      passedTests++;
    } else {
      console.error(`   FAILED: Wrong error type: ${error instanceof Error ? error.constructor.name : 'unknown'}`);
    }
  }

  console.log('\n❌ Test 4: Non-existent task ID (NotFoundError)');
  console.log('-'.repeat(50));
  totalTests++;
  try {
    await client.textToVideo.get('non-existent-task-id-12345');
    console.error('   FAILED: Should have thrown NotFoundError');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('   ✅ PASSED: Correctly threw NotFoundError');
      console.log(`      Message: ${error.message}`);
      passedTests++;
    } else {
      console.error(`   FAILED: Wrong error type: ${error instanceof Error ? error.constructor.name : 'unknown'}`);
    }
  }

  console.log('\n📊 Error Handling Test Summary:');
  console.log('='.repeat(50));
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All error handling tests passed!\n');
  } else {
    console.log('\n⚠️  Some tests failed\n');
    process.exit(1);
  }
}

main();
