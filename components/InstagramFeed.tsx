import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

const { width } = Dimensions.get('window');
const POST_HEIGHT = 700;

export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>(
    postUrls.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const { colors } = useTheme();

  const handleOpenPost = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening Instagram post:', error);
    }
  };

  // Extract post ID from URL for embed
  const getEmbedUrl = (url: string) => {
    const match = url.match(/\/p\/([^\/]+)/);
    if (match) {
      return `https://www.instagram.com/p/${match[1]}/embed/`;
    }
    return null;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {postUrls.map((url, index) => {
        const embedUrl = getEmbedUrl(url);
        
        return (
          <View key={index} style={styles.postContainer}>
            {loadingStates[index] && (
              <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textLight }]}>
                  Loading post...
                </Text>
              </View>
            )}
            
            {embedUrl && (
              <iframe
                src={embedUrl}
                style={{
                  width: '100%',
                  height: POST_HEIGHT,
                  border: 'none',
                  borderRadius: BORDER_RADIUS.xl,
                  overflow: 'hidden',
                  opacity: loadingStates[index] ? 0 : 1,
                }}
                onLoad={() => {
                  setLoadingStates(prev => ({ ...prev, [index]: false }));
                }}
                scrolling="no"
                allowTransparency={true}
              />
            )}
            
            <TouchableOpacity
              style={[styles.openButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOpenPost(url)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
              <Text style={styles.openButtonText}>Open in Instagram</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  postContainer: {
    width: '100%',
    maxWidth: 500,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.large,
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