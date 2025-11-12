import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (SPACING.lg * 2);
const POST_HEIGHT = 600;

export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>(
    postUrls.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const { colors } = useTheme();

  const generateEmbedHTML = (url: string) => {
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
              display: flex;
              justify-content: center;
              align-items: flex-start;
              min-height: 100vh;
              padding: 0;
            }
            .instagram-container {
              width: 100%;
              max-width: 540px;
              margin: 0 auto;
            }
            blockquote {
              margin: 0 !important;
            }
          </style>
        </head>
        <body>
          <div class="instagram-container">
            <blockquote 
              class="instagram-media" 
              data-instgrm-permalink="${url}"
              data-instgrm-version="14"
              style="
                background:#FFF; 
                border:0; 
                border-radius:12px; 
                box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); 
                margin: 0; 
                max-width:540px; 
                min-width:326px; 
                padding:0; 
                width:100%;
              ">
            </blockquote>
          </div>
          <script async src="//www.instagram.com/embed.js"></script>
        </body>
      </html>
    `;
  };

  const handleOpenPost = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening Instagram post:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {postUrls.map((url, index) => (
        <View key={index} style={[styles.postCard, { backgroundColor: colors.surface }]}>
          {loadingStates[index] && (
            <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textLight }]}>
                Loading post...
              </Text>
            </View>
          )}
          
          <WebView
            source={{ html: generateEmbedHTML(url) }}
            style={[
              styles.webview,
              { opacity: loadingStates[index] ? 0 : 1 }
            ]}
            onLoadEnd={() => {
              setLoadingStates(prev => ({ ...prev, [index]: false }));
            }}
            onError={(error) => {
              console.error('WebView error:', error);
              setLoadingStates(prev => ({ ...prev, [index]: false }));
            }}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={Platform.OS === 'android'}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            originWhitelist={['*']}
            allowsInlineMediaPlayback={true}
          />
          
          <TouchableOpacity
            style={[styles.openButton, { backgroundColor: colors.primary }]}
            onPress={() => handleOpenPost(url)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
            <Text style={styles.openButtonText}>Open in Instagram</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  postCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  webview: {
    width: CARD_WIDTH,
    height: POST_HEIGHT,
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
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  openButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});