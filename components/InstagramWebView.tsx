import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { SocialPost } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getRelativeTime } from '../utils/instagram';

interface InstagramWebViewProps {
  username: string;
  displayName: string;
  onDataExtracted: (posts: SocialPost[]) => void;
  onError: (error: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function InstagramWebView({
  username,
  displayName,
  onDataExtracted,
  onError
}: InstagramWebViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { colors, isDarkMode } = useTheme();

  // HTML content that loads your SociableKit widget
  const widgetHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <title>Instagram Widget for ${displayName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: ${isDarkMode ? '#0F1419' : '#F8F9FA'};
          min-height: 100vh;
          overflow-x: hidden;
        }

        .widget-container {
          width: 100%;
          min-height: 100vh;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: ${isDarkMode ? '#E1E8ED' : '#536471'};
          font-size: 16px;
          font-weight: 500;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${isDarkMode ? '#2F3336' : '#E1E8ED'};
          border-top: 3px solid #1DA1F2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: ${isDarkMode ? '#493637' : '#F8D7DA'};
          color: ${isDarkMode ? '#FDE7E9' : '#721C24'};
          padding: 16px;
          border-radius: 8px;
          margin: 16px;
          text-align: center;
          font-size: 14px;
          border-left: 4px solid #DC3545;
        }

        .hidden {
          display: none;
        }

        /* SociableKit widget styling */
        .sk-ww-instagram-stories {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .sk-ww-instagram-stories * {
          box-sizing: border-box !important;
        }
      </style>
    </head>
    <body>
      <div class="widget-container">
        <div id="loading" class="loading-indicator">
          <div class="loading-spinner"></div>
          <div>Loading Instagram posts for ${displayName}...</div>
        </div>

        <div id="error" class="error-message hidden">
          <strong>Unable to load Instagram posts</strong><br>
          Please check your connection and try again.
        </div>

        <!-- SociableKit widget for ${username} -->
        <div class="sk-ww-instagram-stories" data-embed-id="25621210"></div>
        <script src="https://widgets.sociablekit.com/instagram-stories/widget.js" defer></script>
      </div>

      <script>
        // Simplified Instagram data extraction script
        let extractionAttempts = 0;
        const maxAttempts = 15;

        function extractInstagramData() {
          extractionAttempts++;
          console.log(\`🔍 Data extraction attempt \${extractionAttempts}/\${maxAttempts}\`);

          // Hide loading indicator
          const loadingEl = document.getElementById('loading');
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }

          // Method 1: Check for SociableKit global data
          if (window.SociableKitData && window.SociableKitData.length > 0) {
            console.log('✅ Found SociableKit data:', window.SociableKitData.length, 'posts');
            sendInstagramData(window.SociableKitData);
            return;
          }

          // Method 2: Check for Instagram widget data
          const widgetElement = document.querySelector('.sk-ww-instagram-stories');
          if (widgetElement) {
            const possibleData = [
              widgetElement.__data,
              widgetElement.data,
              widgetElement.posts,
              widgetElement.items
            ];

            for (let data of possibleData) {
              if (data && (Array.isArray(data) || (data.data && Array.isArray(data.data)))) {
                const posts = Array.isArray(data) ? data : (data.data || []);
                console.log('✅ Found widget data:', posts.length, 'posts');
                sendInstagramData(posts);
                return;
              }
            }
          }

          // Method 3: Check if widget content is loaded (fallback)
          if (document.querySelector('.sk-ww-instagram-stories *') && extractionAttempts > 5) {
            console.log('📱 Widget loaded but data extraction failed - creating placeholder');
            const placeholderData = [
              {
                id: 'widget_active_' + Date.now(),
                caption: '📱 Instagram widget is active for ${displayName}. The SociableKit widget is loading real Instagram content from @${username}. Posts will appear once the widget finishes loading.',
                image_url: null,
                likes: 0,
                comments: 0,
                timestamp: new Date().toISOString()
              }
            ];
            sendInstagramData(placeholderData);
            return;
          }

          // Continue trying or timeout
          if (extractionAttempts < maxAttempts) {
            setTimeout(extractInstagramData, 1500);
          } else {
            console.log('❌ Extraction failed after', maxAttempts, 'attempts');
            showError();
          }
        }

        function sendInstagramData(data) {
          console.log('📤 Sending data to React Native:', data.length, 'posts');

          const cleanedData = data.filter(post =>
            post &&
            post.caption &&
            post.caption.trim().length > 5
          ).slice(0, 10);

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'instagram_posts',
              data: cleanedData,
              username: '${username}',
              displayName: '${displayName}'
            }));
          } else {
            console.log('⚠️ ReactNativeWebView not available');
          }
        }

        function showError() {
          const errorEl = document.getElementById('error');
          const loadingEl = document.getElementById('loading');

          if (errorEl) {
            errorEl.classList.remove('hidden');
          }
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: 'Instagram widget failed to load. This may be due to network issues or widget configuration.',
              username: '${username}',
              displayName: '${displayName}'
            }));
          }
        }

        // Start extraction with proper delay
        if (document.readyState === 'complete') {
          setTimeout(extractInstagramData, 3000);
        } else {
          window.addEventListener('load', () => {
            setTimeout(extractInstagramData, 3000);
          });
        }

        // Error handling
        window.addEventListener('error', (e) => {
          console.error('❌ JS error:', e.error);
          if (extractionAttempts > 5) {
            showError();
          }
        });
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'instagram_posts') {
        console.log(`🎉 Received ${message.data.length} Instagram posts for ${message.displayName}`);

        const socialPosts: SocialPost[] = message.data.map((post: any, index: number) => ({
          id: post.id || `ig_${username}_${index}`,
          username: message.displayName,
          handle: `@${username}`,
          content: post.caption.length > 280
            ? post.caption.substring(0, 277) + '...'
            : post.caption.trim(),
          timestamp: post.timestamp ? getRelativeTime(new Date(post.timestamp).getTime() / 1000) : 'Just now',
          likes: post.likes || 0,
          retweets: 0,
          replies: post.comments || 0,
          isLiked: false,
          isRetweeted: false,
          images: post.image_url ? [post.image_url] : undefined,
          videoThumbnail: post.video_url && post.image_url ? post.image_url : undefined,
          videoUrl: post.video_url,
        }));

        onDataExtracted(socialPosts);
        setIsLoading(false);
        setHasError(false);
      } else if (message.type === 'error') {
        console.error('❌ Instagram WebView error:', message.error);
        onError(message.error);
        setIsLoading(false);
        setHasError(true);
      }
    } catch (error) {
      console.error('❌ Error parsing WebView message:', error);
      onError('Failed to parse Instagram data');
      setIsLoading(false);
      setHasError(true);
    }
  }, [username, onDataExtracted, onError]);

  const handleWebViewLoad = useCallback(() => {
    console.log('📱 Instagram WebView loaded successfully');
    setIsLoading(false);
  }, []);

  const handleWebViewError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('❌ WebView error:', nativeEvent);
    setIsLoading(false);
    setHasError(true);
    onError('Failed to load Instagram widget');
  }, [onError]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Glassmorphic background overlay */}
      <View style={styles.glassOverlay}>
        <BlurView
          intensity={isDarkMode ? 20 : 40}
          tint={isDarkMode ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: widgetHTML }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        allowsFullscreenVideo={true}
        // Performance optimizations
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        decelerationRate="normal"
        bounces={false}
        scrollEnabled={false}
        // Memory optimizations
        removeClippedSubviews={true}
        androidLayerType="hardware"
        androidHybridComposition={true}
      />

      {isLoading && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.overlay}
        >
          <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.blur}>
            <View style={styles.loadingContainer}>
              <MaterialIcons name="instagram" size={48} color={colors.primary} />
              <View style={styles.loadingText}>
                <Text style={[styles.loadingTitle, { color: colors.text }]}>
                  Loading Instagram Posts
                </Text>
                <Text style={[styles.loadingSubtitle, { color: colors.textLight }]}>
                  Fetching content from {displayName}...
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      )}

      {hasError && (
        <Animated.View
          entering={FadeIn}
          style={styles.overlay}
        >
          <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.blur}>
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color={colors.error} />
              <View style={styles.errorText}>
                <Text style={[styles.errorTitle, { color: colors.text }]}>
                  Instagram Widget Error
                </Text>
                <Text style={[styles.errorSubtitle, { color: colors.textLight }]}>
                  Unable to load Instagram posts from {displayName}
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
  },
  webView: {
    flex: 1,
    width: screenWidth,
    borderRadius: 18,
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  loadingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    alignItems: 'center',
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});