const fetch = require('node-fetch');

// Test function to fetch SociableKit widget
async function testSociableKitWidget() {
  try {
    console.log('🔥 Testing SociableKit widget fetch...');

    // Your exact widget code
    const widgetJsUrl = 'https://widgets.sociablekit.com/instagram-stories/widget.js';

    console.log(`📡 Fetching widget JavaScript from: ${widgetJsUrl}`);

    const response = await fetch(widgetJsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Accept': 'application/javascript, text/javascript, */*',
        'Referer': 'https://widgets.sociablekit.com/',
      },
      // No timeout signal - this was causing the React Native error!
    });

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response headers:`, response.headers.raw());

    if (!response.ok) {
      console.log(`❌ Widget fetch failed: ${response.status} ${response.statusText}`);
      return;
    }

    const widgetJS = await response.text();
    console.log(`📄 Widget JavaScript length: ${widgetJS.length} characters`);

    if (widgetJS.length > 0) {
      console.log('✅ SUCCESS: SociableKit widget JavaScript loaded successfully!');
      console.log(`📄 First 200 characters: ${widgetJS.substring(0, 200)}...`);

      // Look for Instagram data patterns
      const dataPatterns = [
        /"data":\s*(\[.+?\])/g,
        /"items":\s*(\[.+?\])/g,
        /"posts":\s*(\[.+?\])/g
      ];

      let foundData = false;
      for (const pattern of dataPatterns) {
        const matches = [...widgetJS.matchAll(pattern)];
        if (matches.length > 0) {
          console.log(`✅ Found ${matches.length} potential Instagram data arrays!`);
          foundData = true;
        }
      }

      if (!foundData) {
        console.log('⚠️ No Instagram data found in widget JavaScript, but the file loaded successfully');
        console.log('This might mean the widget needs to be activated or configured properly');
      }

    } else {
      console.log('❌ Widget JavaScript is empty');
    }

  } catch (error) {
    console.error('💥 ERROR testing SociableKit widget:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testSociableKitWidget();