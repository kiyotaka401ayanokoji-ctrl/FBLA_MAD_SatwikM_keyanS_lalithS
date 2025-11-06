// Simple test script to verify environment variable loading
console.log('Testing environment variable loading...');

// Mock Constants for testing
const mockConstants = {
  expoConfig: {
    extra: {
      "EXPO_PUBLIC_KIKI_API_KEY": "proj_f2af9daa_3ZR2SDrop5YD4nSLzVq5ANbj",
      "EXPO_PUBLIC_KIKI_BASE_URL": "https://kiki-unkey-proxy.chris-d9a.workers.dev/"
    }
  }
};

// Test the environment variable loading logic
function testEnvironmentVariableLoading() {
  console.log('\n=== Testing Environment Variable Loading ===');

  const extra = mockConstants.expoConfig?.extra;
  console.log('1. expoConfig.extra exists:', !!extra);
  console.log('2. expoConfig.extra type:', typeof extra);
  console.log('3. expoConfig.extra keys:', extra ? Object.keys(extra) : 'none');

  if (extra) {
    const baseURL = extra["EXPO_PUBLIC_KIKI_BASE_URL"];
    const apiKey = extra["EXPO_PUBLIC_KIKI_API_KEY"];

    console.log('\n4. Base URL value:', baseURL);
    console.log('   - Type:', typeof baseURL);
    console.log('   - Length:', baseURL ? baseURL.length : 'N/A');
    console.log('   - Trimmed length:', baseURL ? baseURL.trim().length : 'N/A');
    console.log('   - Starts with HTTP:', baseURL ? (baseURL.startsWith('http://') || baseURL.startsWith('https://')) : false);

    console.log('\n5. API Key value:', apiKey ? '***masked***' : 'undefined');
    console.log('   - Type:', typeof apiKey);
    console.log('   - Length:', apiKey ? apiKey.length : 'N/A');
    console.log('   - Trimmed length:', apiKey ? apiKey.trim().length : 'N/A');

    // Test URL construction
    if (baseURL) {
      try {
        const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        const fullUrl = `${cleanBase}/v1/chat/completions`;
        console.log('\n6. Constructed API URL:', fullUrl);
        console.log('   - Valid URL:', (() => {
          try {
            new URL(fullUrl);
            return true;
          } catch {
            return false;
          }
        })());
      } catch (error) {
        console.log('\n6. URL construction failed:', error);
      }
    }
  }

  console.log('\n=== Test Complete ===\n');
}

// Run the test
testEnvironmentVariableLoading();