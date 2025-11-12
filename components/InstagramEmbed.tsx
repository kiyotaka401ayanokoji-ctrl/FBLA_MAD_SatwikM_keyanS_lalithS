import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramEmbedProps {
  postUrl: string;
}

const { width } = Dimensions.get('window');

export default function InstagramEmbed({ postUrl }: InstagramEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colors, isDarkMode } = useTheme();

  // Extract post ID from URL
  const getPostId = (url: string) => {
    const match = url.match(/\/p\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const postId = getPostId(postUrl);

  const handleOpenInInstagram = async () => {
    try {
      await Linking.openURL(postUrl);
    } catch (err) {
      console.error('Error opening Instagram:', err);
    }
  };

  if (!postId) {
    return null;
  }

  // Instagram embed HTML
  const embedHtml = `
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
            overflow: hidden;
          }
          .instagram-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          blockquote {
            margin: 0 !important;
            min-width: 326px;
            max-width: 540px;
          }
        </style>
      </head>
      <body>
        <div class="instagram-container">
          <blockquote 
            class="instagram-media" 
            data-instgrm-permalink="${postUrl}"
            data-instgrm-version="14"
            style="background:#FFF; border:0; border-radius:12px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
          </blockquote>
        </div>
        <script async src="//www.instagram.com/embed.js"></script>
      </body>
    </html>
  `;

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="error-outline" size={32} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.textLight }]}>
          Failed to load post
        </Text>
        <TouchableOpacity 
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={handleOpenInInstagram}
        >
          <Text style={styles.openButtonText}>Open in Instagram</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <WebView
        source={{ html: embedHtml }}
        style={[styles.webview, { opacity: loading ? 0 : 1 }]}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - (SPACING.lg * 2),
    height: 600,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
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
  errorContainer: {
    width: width - (SPACING.lg * 2),
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  openButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  openButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});