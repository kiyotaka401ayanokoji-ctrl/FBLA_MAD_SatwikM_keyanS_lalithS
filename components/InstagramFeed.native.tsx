import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

interface PostData {
  thumbnail_url?: string;
  author_name?: string;
  title?: string;
  url: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (SPACING.lg * 2);

export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchPostData();
  }, [postUrls]);

  const fetchPostData = async () => {
    setLoading(true);
    const fetchedPosts: PostData[] = [];

    for (const url of postUrls) {
      try {
        // Use Instagram's oEmbed API to get post data
        const response = await fetch(
          `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=YOUR_TOKEN&fields=thumbnail_url,author_name,title`
        );
        
        if (response.ok) {
          const data = await response.json();
          fetchedPosts.push({
            thumbnail_url: data.thumbnail_url,
            author_name: data.author_name,
            title: data.title,
            url: url,
          });
        } else {
          // Fallback if API fails
          fetchedPosts.push({ url });
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
        // Add post with just URL as fallback
        fetchedPosts.push({ url });
      }
    }

    setPosts(fetchedPosts);
    setLoading(false);
  };

  const handleOpenPost = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening Instagram post:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          Loading posts...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {posts.map((post, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.postCard, { backgroundColor: colors.surface }]}
          onPress={() => handleOpenPost(post.url)}
          activeOpacity={0.9}
        >
          {post.thumbnail_url ? (
            <Image 
              source={{ uri: post.thumbnail_url }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.backgroundSecondary }]}>
              <MaterialIcons name="photo" size={64} color={colors.textLight} />
            </View>
          )}
          
          <View style={styles.postContent}>
            <View style={styles.postHeader}>
              <MaterialIcons name="camera-alt" size={20} color={colors.primary} />
              <Text style={[styles.authorName, { color: colors.text }]}>
                {post.author_name || '@fbla.nchs'}
              </Text>
            </View>
            
            {post.title && (
              <Text 
                style={[styles.postTitle, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {post.title}
              </Text>
            )}
            
            <View style={styles.postFooter}>
              <MaterialIcons name="open-in-new" size={16} color={colors.primary} />
              <Text style={[styles.viewText, { color: colors.primary }]}>
                View on Instagram
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
  postCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  postImage: {
    width: '100%',
    height: CARD_WIDTH,
  },
  placeholderImage: {
    width: '100%',
    height: CARD_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  authorName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  postTitle: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  viewText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});