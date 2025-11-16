import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramPostCardProps {
  postUrl: string;
  username?: string;
  index?: number;
}


export default function InstagramPostCard({ postUrl, username = '@fbla.nchs', index = 0 }: InstagramPostCardProps) {
  const { colors, isDarkMode } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Extract post ID from URL
  const extractPostId = (url: string): string => {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
  };

  const postId = extractPostId(postUrl);
  
  // Instagram's public image URL (works without auth!)
  const imageUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

  const handleOpenPost = async () => {
    try {
      await Linking.openURL(postUrl);
    } catch (error) {
      console.error('Error opening Instagram post:', error);
    }
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity
        onPress={handleOpenPost}
        activeOpacity={0.85}
      >
        <BlurView
          intensity={isDarkMode ? 45 : 60}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.container, SHADOWS.medium]}
        >
          <View style={[styles.cardInner, {
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1.5,
            backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)'
          }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileSection}>
                <View style={[styles.profileIcon, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
                  <Text style={[styles.platform, { color: colors.textLight }]}>Instagram</Text>
                </View>
              </View>
            </View>

            {/* Post Image */}
            <View style={styles.imageContainer}>
              {imageLoading && !imageError && (
                <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' }]}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.textLight }]}>
                    Loading image...
                  </Text>
                </View>
              )}
              
              {imageError ? (
                <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' }]}>
                  <MaterialIcons name="broken-image" size={48} color={colors.textLight} />
                  <Text style={[styles.errorText, { color: colors.textLight }]}>
                    Tap to view on Instagram
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.actionRow}>
                <View style={styles.iconGroup}>
                  <MaterialIcons name="favorite-border" size={24} color={colors.text} />
                  <MaterialIcons name="chat-bubble-outline" size={24} color={colors.text} style={styles.iconSpacing} />
                  <MaterialIcons name="send" size={24} color={colors.text} style={styles.iconSpacing} />
                </View>
                <MaterialIcons name="bookmark-border" size={24} color={colors.text} />
              </View>
              
              <TouchableOpacity
                style={[styles.viewButton, { backgroundColor: colors.primary }]}
                onPress={handleOpenPost}
              >
                <Text style={styles.viewButtonText}>View Full Post</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    marginHorizontal: 0,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  cardInner: {
    borderRadius: 18,
  },
  header: {
    padding: SPACING.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  username: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  platform: {
    ...TYPOGRAPHY.caption,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.sm,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.sm,
  },
  footer: {
    padding: SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: SPACING.md,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  viewButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});