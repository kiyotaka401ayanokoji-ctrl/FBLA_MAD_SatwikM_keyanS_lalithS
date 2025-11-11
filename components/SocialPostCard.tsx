import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
import { SocialPost } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface SocialPostCardProps {
  post: SocialPost;
  index: number;
  onLike?: (id: string) => void;
  onRetweet?: (id: string) => void;
}

export default function SocialPostCard({ post, index, onLike, onRetweet }: SocialPostCardProps) {
  const { colors, isDarkMode } = useTheme();
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<number>>(new Set());

  const handleImageError = (imageIndex: number) => {
    setImageLoadErrors(prev => new Set(prev).add(imageIndex));
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageIndex);
      return newSet;
    });
  };

  const handleImageLoad = (imageIndex: number) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageIndex);
      return newSet;
    });
  };

  const handleOpenPost = async () => {
    // For Instagram posts, construct the Instagram URL
    const instagramUrl = `https://www.instagram.com/p/${post.id}/`;
    try {
      await WebBrowser.openBrowserAsync(instagramUrl);
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const handleVideoPlay = async () => {
    if (post.videoUrl) {
      try {
        await WebBrowser.openBrowserAsync(post.videoUrl);
      } catch (error) {
        console.error('Error opening video:', error);
      }
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
      <BlurView 
        intensity={isDarkMode ? 45 : 95} 
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.container, SHADOWS.medium]}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={handleOpenPost}
        >
          <View style={[styles.cardInner, { 
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
            borderWidth: 1.5,
            backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
          }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <MaterialIcons name="account-circle" size={40} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
                  {post.username}
                </Text>
                <Text style={[styles.handle, { color: colors.textLight }]} numberOfLines={1}>
                  {post.handle} • {post.timestamp}
                </Text>
              </View>
              <MaterialIcons name="more-vert" size={20} color={colors.textLight} />
            </View>
            
            {/* Content */}
            <Text style={[styles.content, { color: colors.textSecondary }]}>
              {post.content}
            </Text>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <View style={styles.mediaContainer}>
                {post.images.length === 1 ? (
                  <View style={styles.singleImageContainer}>
                    <Image
                      source={{ uri: post.images[0] }}
                      style={[styles.singleImage, { backgroundColor: colors.surface }]}
                      resizeMode="cover"
                      onError={() => handleImageError(0)}
                      onLoad={() => handleImageLoad(0)}
                    />
                    {imageLoading.has(0) && (
                      <View style={[styles.imageLoadingOverlay, { backgroundColor: colors.surface + '99' }]}>
                        <MaterialIcons name="image" size={32} color={colors.textLight} />
                      </View>
                    )}
                    {imageLoadErrors.has(0) && (
                      <View style={[styles.imageErrorOverlay, { backgroundColor: colors.surface + '99' }]}>
                        <MaterialIcons name="broken-image" size={32} color={colors.error} />
                      </View>
                    )}
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageScrollContainer}
                    contentContainerStyle={styles.imageScrollContent}
                  >
                    {post.images.map((imageUrl, imageIndex) => (
                      <View key={imageIndex} style={styles.multiImageContainer}>
                        <Image
                          source={{ uri: imageUrl }}
                          style={[styles.multiImage, { backgroundColor: colors.surface }]}
                          resizeMode="cover"
                          onError={() => handleImageError(imageIndex)}
                          onLoad={() => handleImageLoad(imageIndex)}
                        />
                        {imageLoading.has(imageIndex) && (
                          <View style={[styles.imageLoadingOverlay, { backgroundColor: colors.surface + '99' }]}>
                            <MaterialIcons name="image" size={24} color={colors.textLight} />
                          </View>
                        )}
                        {imageLoadErrors.has(imageIndex) && (
                          <View style={[styles.imageErrorOverlay, { backgroundColor: colors.surface + '99' }]}>
                            <MaterialIcons name="broken-image" size={24} color={colors.error} />
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Video Thumbnail */}
            {post.videoThumbnail && (
              <TouchableOpacity
                style={styles.videoContainer}
                onPress={handleVideoPlay}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: post.videoThumbnail }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={[styles.videoOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
                  <View style={[styles.playButton, { backgroundColor: colors.primary + 'EE' }]}>
                    <MaterialIcons name="play-arrow" size={32} color="#FFFFFF" />
                  </View>
                  <View style={[styles.videoDuration, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
                    <Text style={styles.videoDurationText}>
                      {post.videoDuration || '0:00'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Footer Actions */}
            <View style={[styles.footer, { borderTopColor: colors.divider }]}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onLike?.(post.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name={post.isLiked ? 'favorite' : 'favorite-border'} 
                  size={18} 
                  color={post.isLiked ? colors.error : colors.textLight} 
                />
                <Text style={[styles.actionText, { 
                  color: post.isLiked ? colors.error : colors.textLight 
                }]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onRetweet?.(post.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="repeat" 
                  size={18} 
                  color={post.isRetweeted ? colors.success : colors.textLight} 
                />
                <Text style={[styles.actionText, { 
                  color: post.isRetweeted ? colors.success : colors.textLight 
                }]}>
                  {post.retweets}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <MaterialIcons name="chat-bubble-outline" size={18} color={colors.textLight} />
                <Text style={[styles.actionText, { color: colors.textLight }]}>
                  {post.replies}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <MaterialIcons name="share" size={18} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  cardInner: {
    padding: SPACING.md,
    borderRadius: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  headerText: {
    flex: 1,
  },
  username: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  handle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  content: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  mediaContainer: {
    marginBottom: SPACING.md,
  },
  singleImageContainer: {
    width: '100%',
    height: 300,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  imageScrollContainer: {
    maxHeight: 250,
  },
  imageScrollContent: {
    gap: SPACING.sm,
  },
  multiImageContainer: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  multiImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});
