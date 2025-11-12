import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  // Generate the combined HTML with all Instagram embeds
  const generateEmbedHTML = () => {
    const embedBlocks = postUrls.map((url) => `
      <blockquote 
        class="instagram-media" 
        data-instgrm-permalink="${url}"
        data-instgrm-version="14"
        style="
          background:#FFF; 
          border:0; 
          border-radius:12px; 
          box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); 
          margin: 16px auto; 
          max-width:540px; 
          min-width:326px; 
          padding:0; 
          width:99.375%; 
          width:-webkit-calc(100% - 2px); 
          width:calc(100% - 2px);
        ">
      </blockquote>
    `).join('\n');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              background: transparent;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 8px;
              overflow-x: hidden;
            }
            .instagram-feed-container {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-bottom: 40px;
            }
            blockquote {
              margin: 16px 0 !important;
            }
          </style>
        </head>
        <body>
          <div class="instagram-feed-container">
            ${embedBlocks}
          </div>
          <script async src="//www.instagram.com/embed.js"></script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>
          Follow us on Instagram @fbla.nchs 📸
        </Text>
      </View>

      {/* Instagram Feed WebView */}
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textLight }]}>
              Loading posts...
            </Text>
          </View>
        )}
        <WebView
          source={{ html: generateEmbedHTML() }}
          style={[styles.webview, { opacity: loading ? 0 : 1 }]}
          onLoadEnd={() => setLoading(false)}
          onError={(error) => {
            console.error('WebView error:', error);
            setLoading(false);
          }}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scrollEnabled={true}
          bounces={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
});
