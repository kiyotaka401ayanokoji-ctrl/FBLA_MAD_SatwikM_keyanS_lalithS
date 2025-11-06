// AI utility with comprehensive debugging, retry logic, and error handling
import Constants from 'expo-constants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Request tracking for debugging
let requestCounter = 0;

// Cache for last successful response
let lastSuccessfulResponse: string | null = null;

// Helper function to chunk text into words
const chunkTextIntoWords = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

// Helper function to simulate streaming with delays
const simulateStreaming = async (words: string[], onChunk: (chunk: string) => void) => {
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50));
    onChunk(word + ' ');
  }
};

// System prompt for FBLA AI Coach
const FBLA_SYSTEM_PROMPT = `You are an AI Coach for FBLA (Future Business Leaders of America), a professional and motivational mentor focused on leadership development, business skills, event preparation, and career readiness.

Your role is to:
- Provide guidance on FBLA competitive events and preparation strategies
- Offer leadership and business skill development advice
- Help with event planning and deadline management
- Share motivational insights about entrepreneurship and career growth
- Answer questions about FBLA programs, competitions, and opportunities
- Suggest relevant events based on member interests

Tone: Professional yet friendly, motivational, and supportive. Keep responses concise (2-4 sentences) unless more detail is specifically requested. Use business terminology appropriately and inspire confidence in members' abilities.

Focus areas: Leadership, business strategy, competition preparation, networking, career development, time management, and FBLA-specific guidance.`;

// Hardcoded fallback values
const FALLBACK_BASE_URL = 'https://kiki-unkey-proxy.chris-d9a.workers.dev';
const FALLBACK_API_KEY = 'proj_f2af9daa_3ZR2SDrop5YD4nSLzVq5ANbj';

// Helper to mask sensitive data for logging
const maskToken = (token: string): string => {
  if (!token || token.length < 8) return '***';
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
};

// Helper function to validate and get environment variables
const getEnvVar = (key: string): string => {
  const requestId = requestCounter;
  console.log(`\n🔍 [Request ${requestId}] Getting env var: ${key}`);

  let value: string | undefined;

  // Try expoConfig.extra first (most reliable for Expo)
  console.log(`  🔄 Checking Constants.expoConfig.extra first...`);
  const extra = Constants.expoConfig?.extra;

  if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
    console.log(`  📦 expoConfig.extra exists, type: ${typeof extra}, keys:`, Object.keys(extra));

    if (key in extra) {
      const extraValue = extra[key];
      console.log(`  📋 expoConfig.extra.${key}:`,
        key.includes('API_KEY') ? maskToken(String(extraValue)) : `"${extraValue}"`
      );
      console.log(`  📏 Type: ${typeof extraValue}, Length: ${String(extraValue).length}, Trimmed length: ${String(extraValue).trim().length}`);

      // More robust validation for expoConfig.extra values
      if (extraValue !== null && extraValue !== undefined) {
        const stringValue = String(extraValue);

        // Check for common corruption patterns
        const isCorrupted = stringValue.includes('"router"') ||
                           stringValue.includes('{"origin"') ||
                           stringValue.includes('[object') ||
                           stringValue.includes('undefined') ||
                           stringValue === 'null' ||
                           stringValue === '';

        // Validation criteria based on key type
        const isValid = key === 'EXPO_PUBLIC_KIKI_BASE_URL'
          ? (stringValue.startsWith('http://') || stringValue.startsWith('https://')) && stringValue.length > 15
          : stringValue.length > 10; // API key should be longer than 10 chars

        if (!isCorrupted && isValid) {
          console.log(`  ✅ Valid value found in expoConfig.extra`);
          return stringValue.trim();
        } else {
          console.log(`  ❌ Value in expoConfig.extra is corrupted or invalid (corrupted: ${isCorrupted}, valid: ${isValid})`);
        }
      } else {
        console.log(`  ❌ Value in expoConfig.extra is null or undefined`);
      }
    } else {
      console.log(`  ❌ Key "${key}" not found in expoConfig.extra`);
    }
  } else {
    console.log(`  ❌ expoConfig.extra is not available or not an object (type: ${typeof extra})`);
  }

  // Try process.env as fallback
  console.log(`  🔄 Checking process.env as fallback...`);
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    value = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
    console.log(`  📋 process.env.${key}:`, value ? `"${value}"` : 'undefined');
    console.log(`  📏 Length: ${value?.length || 0}, Trimmed length: ${value?.trim().length || 0}`);
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    value = process.env.EXPO_PUBLIC_KIKI_API_KEY;
    console.log(`  📋 process.env.${key}:`, value ? maskToken(value) : 'undefined');
    console.log(`  📏 Length: ${value?.length || 0}, Trimmed length: ${value?.trim().length || 0}`);
  }

  // Validate the value - must be at least 10 characters for a valid URL/key
  if (value && value.trim().length > 10 && !value.includes('"router"') && !value.includes('{"origin"')) {
    console.log(`  ✅ Valid value found in process.env`);
    return value.trim();
  } else if (value) {
    console.log(`  ❌ Value in process.env is too short or invalid (length: ${value.trim().length})`);
  }

  // Use hardcoded fallback as last resort
  console.log(`  🔄 Using hardcoded fallback value`);
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    console.log(`  ✅ Fallback base URL: ${FALLBACK_BASE_URL}`);
    return FALLBACK_BASE_URL;
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    console.log(`  ✅ Fallback API key: ${maskToken(FALLBACK_API_KEY)}`);
    return FALLBACK_API_KEY;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

// Helper function to properly construct API URL
const constructApiUrl = (baseURL: string): string => {
  console.log(`  🔧 Constructing API URL from base: "${baseURL}"`);

  // Ensure baseURL is a string and not empty
  if (!baseURL || typeof baseURL !== 'string') {
    console.error(`  ❌ Invalid baseURL type or empty: ${typeof baseURL}, value: ${baseURL}`);
    throw new Error(`Base URL must be a non-empty string, got: ${typeof baseURL}`);
  }

  let cleanBase = baseURL.trim();

  // Remove trailing slash if present
  if (cleanBase.endsWith('/')) {
    cleanBase = cleanBase.slice(0, -1);
  }

  console.log(`  🔧 Clean base URL: "${cleanBase}"`);

  // Validate URL format more thoroughly
  try {
    const urlObj = new URL(cleanBase);
    console.log(`  ✅ Valid URL format - Protocol: ${urlObj.protocol}, Host: ${urlObj.host}`);

    // Ensure it's using HTTP or HTTPS
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error(`URL must use HTTP or HTTPS protocol, got: ${urlObj.protocol}`);
    }

  } catch (error) {
    console.error(`  ❌ Invalid URL format:`, error);
    throw new Error(`Invalid base URL format: ${cleanBase}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Add the endpoint path
  const fullUrl = `${cleanBase}/v1/chat/completions`;
  console.log(`  ✅ Full API URL: "${fullUrl}"`);
  return fullUrl;
};

// Sleep helper for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validate response structure
const validateResponse = (data: any): { valid: boolean; error?: string } => {
  if (!data) {
    return { valid: false, error: 'Response data is null or undefined' };
  }
  
  if (!data.choices || !Array.isArray(data.choices)) {
    return { valid: false, error: 'Response missing "choices" array' };
  }
  
  if (data.choices.length === 0) {
    return { valid: false, error: 'Response "choices" array is empty' };
  }
  
  const firstChoice = data.choices[0];
  if (!firstChoice.message) {
    return { valid: false, error: 'First choice missing "message" object' };
  }
  
  if (!firstChoice.message.content || typeof firstChoice.message.content !== 'string') {
    return { valid: false, error: 'Message content is missing or not a string' };
  }
  
  if (firstChoice.message.content.trim() === '') {
    return { valid: false, error: 'Message content is empty' };
  }
  
  return { valid: true };
};

// Main API call with retry logic
const makeApiRequest = async (
  apiUrl: string,
  apiKey: string,
  messages: any[],
  requestId: number,
  attempt: number = 1
): Promise<string> => {
  const maxAttempts = 3;
  
  console.log(`\n📤 [Request ${requestId}] Attempt ${attempt}/${maxAttempts}`);
  console.log(`  🌐 URL: ${apiUrl}`);
  console.log(`  🔑 API Key: ${maskToken(apiKey)}`);
  console.log(`  📨 Messages count: ${messages.length}`);
  console.log(`  📝 User message preview: "${messages[messages.length - 1].content.substring(0, 50)}..."`);
  
  const requestBody = {
    model: 'gpt-4o',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500
  };
  
  console.log(`  📦 Request body:`, JSON.stringify(requestBody, null, 2).substring(0, 300) + '...');
  
  try {
    const startTime = Date.now();
    
    // Set timeout for request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    console.log(`\n📥 [Request ${requestId}] Response received (${duration}ms)`);
    console.log(`  📊 Status: ${response.status} ${response.statusText}`);
    console.log(`  ✓ OK: ${response.ok}`);
    console.log(`  📋 Headers:`, {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  ❌ Error response body:`, errorText.substring(0, 500));
      
      // Retry on 429 or 5xx errors
      if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`  🔄 Retrying after ${delay}ms...`);
        await sleep(delay);
        return makeApiRequest(apiUrl, apiKey, messages, requestId, attempt + 1);
      }
      
      // Return specific error messages
      if (response.status === 404) {
        throw new Error('API endpoint not found (404). Please check the base URL configuration.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again.');
      }
      
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse response
    const data = await response.json();
    console.log(`  ✅ Response parsed successfully`);
    console.log(`  📦 Response structure:`, {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content
    });
    
    // Validate response structure
    const validation = validateResponse(data);
    if (!validation.valid) {
      console.error(`  ❌ Invalid response structure: ${validation.error}`);
      console.error(`  📦 Full response:`, JSON.stringify(data, null, 2).substring(0, 500));
      throw new Error(`Invalid API response: ${validation.error}`);
    }
    
    const aiResponse = data.choices[0].message.content;
    console.log(`  ✅ AI response extracted (${aiResponse.length} chars)`);
    console.log(`  📝 Response preview: "${aiResponse.substring(0, 100)}..."`);
    
    // Cache successful response
    lastSuccessfulResponse = aiResponse;
    
    return aiResponse;
    
  } catch (error) {
    console.error(`\n❌ [Request ${requestId}] Error in attempt ${attempt}:`, error);
    
    // Check if it's a timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`  ⏱️ Request timed out after 15 seconds`);
      
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`  🔄 Retrying after ${delay}ms...`);
        await sleep(delay);
        return makeApiRequest(apiUrl, apiKey, messages, requestId, attempt + 1);
      }
      
      throw new Error('Request timed out. Please check your internet connection.');
    }
    
    // Retry on network errors
    if (attempt < maxAttempts && error instanceof Error && 
        (error.message.includes('network') || error.message.includes('fetch'))) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`  🔄 Network error, retrying after ${delay}ms...`);
      await sleep(delay);
      return makeApiRequest(apiUrl, apiKey, messages, requestId, attempt + 1);
    }
    
    throw error;
  }
};

// Generate AI response with chat history using direct API call
export const generateAIResponse = async (
  userMessage: string, 
  chatHistory: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const requestId = ++requestCounter;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [Request ${requestId}] Starting AI request`);
  console.log(`${'='.repeat(80)}`);
  
  try {
    console.log(`  🎯 Starting AI response generation...`);

    // Get environment variables with fallbacks
    console.log(`  🔧 Loading environment variables...`);
    const baseURL = getEnvVar('EXPO_PUBLIC_KIKI_BASE_URL');
    const apiKey = getEnvVar('EXPO_PUBLIC_KIKI_API_KEY');

    // Final validation
    console.log(`  🔍 Performing final validation...`);
    if (!baseURL || baseURL.trim() === '') {
      console.error(`  ❌ Base URL is empty after all fallback attempts`);
      return lastSuccessfulResponse ||
        "I'm unable to connect to the AI service. Configuration error. Please contact support.";
    }

    if (!apiKey || apiKey.trim() === '') {
      console.error(`  ❌ API Key is empty after all fallback attempts`);
      return lastSuccessfulResponse ||
        "I'm unable to connect to the AI service. Authentication error. Please contact support.";
    }

    console.log(`  ✅ Environment variables loaded successfully`);
    console.log(`    - Base URL: ${baseURL}`);
    console.log(`    - API Key: ${maskToken(apiKey)}`);

    // Construct API URL
    console.log(`  🔗 Constructing API endpoint...`);
    const apiUrl = constructApiUrl(baseURL);
    console.log(`  ✅ API URL constructed: ${apiUrl}`);

    // Create messages array
    console.log(`  💬 Creating message array...`);
    const messages = [
      {
        role: 'system',
        content: FBLA_SYSTEM_PROMPT
      },
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];
    console.log(`  ✅ Message array created with ${messages.length} messages`);

    // Make API request with retry logic
    console.log(`  📡 Making API request...`);
    const aiResponse = await makeApiRequest(apiUrl, apiKey, messages, requestId);

    // Simulate streaming if callback provided
    if (onChunk) {
      console.log(`  🌊 Simulating streaming response...`);
      const words = chunkTextIntoWords(aiResponse);
      await simulateStreaming(words, onChunk);
    }

    console.log(`\n✅ [Request ${requestId}] Request completed successfully`);
    console.log(`${'='.repeat(80)}\n`);

    return aiResponse;

  } catch (error) {
    console.error(`\n❌ [Request ${requestId}] Final error:`, error);
    console.error(`  📊 Error details:`, {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log(`${'='.repeat(80)}\n`);

    // Return user-friendly message with cached response if available
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (lastSuccessfulResponse) {
      console.log(`  💾 Returning last successful response as fallback`);
      return lastSuccessfulResponse;
    }

    // Return specific error message based on error type
    if (errorMessage.includes('404') || errorMessage.includes('endpoint')) {
      return "I'm having trouble connecting to the AI service. The endpoint may be incorrect. Please try again later.";
    } else if (errorMessage.includes('Authentication') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return "I'm having trouble authenticating with the AI service. Please contact support.";
    } else if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
      return "The request took too long. Please check your internet connection and try again.";
    } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
      return "Too many requests. Please wait a moment and try again.";
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return "Network connection issue. Please check your internet and try again.";
    } else if (errorMessage.includes('Invalid base URL')) {
      return "Service configuration error. The AI service URL is invalid. Please contact support.";
    }

    console.log(`  🔄 Returning generic error message`);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Curated motivational quotes
const MOTIVATIONAL_QUOTES = [
  'Great leaders inspire action through vision and purpose.',
  'Success is built on preparation, dedication, and continuous learning.',
  'Leadership is about empowering others to achieve their best.',
  'Innovation starts with curiosity and courage to try.',
  'Your network is your net worth in business.',
  'Excellence is not an act, but a habit.',
  'The best way to predict the future is to create it.',
  'Opportunities multiply as they are seized.',
];

// Get motivational quote
export const getMotivationalQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};
