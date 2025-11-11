import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocialPostCard from '../components/SocialPostCard';
import { fetchNationalPosts, fetchChapterPosts } from '../utils/instagram';
import { SocialPost } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type TabType = 'national' | 'chapter';

const TAB_STORAGE_KEY = '@announcements_last_tab';
const CACHE_KEY_NATIONAL = '@announcements_national_cache';
const CACHE_KEY_CHAPTER = '@announcements_chapter_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export default function AnnouncementsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('national');
  const [nationalPosts, setNationalPosts] = useState<SocialPost[]>([]);
  const [chapterPosts, setChapterPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, isDarkMode } = useTheme();

  // Load cached data and fetch fresh data on mount
  useEffect(() => {
    loadLastTab();
    loadCachedData();
    fetchAllPosts();
  }, []);

  // Save tab when it changes
  useEffect(() => {
    saveLastTab(activeTab);
  }, [activeTab]);

  const loadLastTab = async () => {
    try {
      const savedTab = await AsyncStorage.getItem(TAB_STORAGE_KEY);
      if (savedTab === 'national' || savedTab === 'chapter') {
        setActiveTab(savedTab);
      }
    } catch (error) {
      console.error('Error loading last tab:', error);
    }
  };

  const saveLastTab = async (tab: TabType) => {
    try {
      await AsyncStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch (error) {
      console.error('Error saving last tab:', error);
    }
  };

  const loadCachedData = async () => {
    try {
      const [nationalCache, chapterCache] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY_NATIONAL),
        AsyncStorage.getItem(CACHE_KEY_CHAPTER),
      ]);

      if (nationalCache) {
        const { data, timestamp } = JSON.parse(nationalCache);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setNationalPosts(data);
        }
      }

      if (chapterCache) {
        const { data, timestamp } = JSON.parse(chapterCache);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setChapterPosts(data);
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheData = async (key: string, data: SocialPost[]) => {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const fetchAllPosts = async () => {
    console.log('🚀 Starting fetchAllPosts...');
    const startTime = Date.now();

    try {
      setError(null);
      console.log('📡 Fetching National and Chapter posts concurrently...');

      const [national, chapter] = await Promise.allSettled([
        fetchNationalPosts(),
        fetchChapterPosts(),
      ]);

      // Handle results with detailed logging
      let nationalPosts: SocialPost[] = [];
      let chapterPosts: SocialPost[] = [];
      let hasNationalError = false;
      let hasChapterError = false;

      if (national.status === 'fulfilled') {
        nationalPosts = national.value;
        console.log(`✅ National posts loaded: ${nationalPosts.length} posts`);
      } else {
        hasNationalError = true;
        console.error('❌ National posts failed:', national.reason);
      }

      if (chapter.status === 'fulfilled') {
        chapterPosts = chapter.value;
        console.log(`✅ Chapter posts loaded: ${chapterPosts.length} posts`);
      } else {
        hasChapterError = true;
        console.error('❌ Chapter posts failed:', chapter.reason);
      }

      // Always set posts, even if empty
      setNationalPosts(nationalPosts);
      setChapterPosts(chapterPosts);

      // Cache the data if successful
      if (nationalPosts.length > 0) {
        await cacheData(CACHE_KEY_NATIONAL, nationalPosts);
        console.log('💾 National posts cached');
      }
      if (chapterPosts.length > 0) {
        await cacheData(CACHE_KEY_CHAPTER, chapterPosts);
        console.log('💾 Chapter posts cached');
      }

      const duration = Date.now() - startTime;
      console.log(`📊 fetchAllPosts completed in ${duration}ms`);

      // Determine error state with specific messages
      if (nationalPosts.length === 0 && chapterPosts.length === 0) {
        if (hasNationalError && hasChapterError) {
          setError('📵 Unable to connect to social feeds. Please check your internet connection.');
        } else if (hasNationalError) {
          setError('🏛️ National feed temporarily unavailable. Showing Chapter updates only.');
        } else if (hasChapterError) {
          setError('🏫 Chapter feed temporarily unavailable. Showing National updates only.');
        } else {
          setError('📭 No posts available at the moment. Please check back later.');
        }
      } else {
        console.log(`🎉 Success: ${nationalPosts.length} National + ${chapterPosts.length} Chapter posts loaded`);
        if (hasNationalError) {
          console.log('⚠️ National feed had issues but using cached/curated content');
        }
        if (hasChapterError) {
          console.log('⚠️ Chapter feed had issues but using cached/curated content');
        }
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`💥 CRITICAL ERROR in fetchAllPosts (${duration}ms):`, {
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      // Don't set error if we have cached data
      if (nationalPosts.length === 0 && chapterPosts.length === 0) {
        setError('🚨 Something went wrong while loading posts. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log(`🏁 fetchAllPosts finished in ${Date.now() - startTime}ms`);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllPosts();
  };

  const handleLike = (id: string) => {
    if (activeTab === 'national') {
      setNationalPosts(prev => prev.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }));
    } else {
      setChapterPosts(prev => prev.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }));
    }
  };

  const handleRetweet = (id: string) => {
    if (activeTab === 'national') {
      setNationalPosts(prev => prev.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isRetweeted: !post.isRetweeted,
            retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1,
          };
        }
        return post;
      }));
    } else {
      setChapterPosts(prev => prev.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isRetweeted: !post.isRetweeted,
            retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1,
          };
        }
        return post;
      }));
    }
  };

  const currentPosts = activeTab === 'national' ? nationalPosts : chapterPosts;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDarkMode 
          ? [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, colors.backgroundGradient4]
          : [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, colors.backgroundGradient4]
        }
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Announcements</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
              Live from Instagram
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: colors.surface }]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <MaterialIcons 
              name="refresh" 
              size={22} 
              color={colors.primary}
              style={refreshing ? { opacity: 0.5 } : {}}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.tabContainer}>
          <View style={[styles.tabBar, { 
            backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.3)' : 'rgba(255, 255, 255, 0.6)',
          }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'national' && [styles.activeTab, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('national')}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name="public" 
                size={20} 
                color={activeTab === 'national' ? '#FFFFFF' : colors.textLight} 
              />
              <Text style={[
                styles.tabText,
                { color: activeTab === 'national' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                National Updates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'chapter' && [styles.activeTab, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('chapter')}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name="school" 
                size={20} 
                color={activeTab === 'chapter' ? '#FFFFFF' : colors.textLight} 
              />
              <Text style={[
                styles.tabText,
                { color: activeTab === 'chapter' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                Chapter Updates
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Posts Feed */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textLight }]}>
              Loading posts...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {error ? (
              <Animated.View 
                entering={FadeIn.delay(400)}
                style={[styles.emptyState, { backgroundColor: colors.surface }]}
              >
                <MaterialIcons name="error-outline" size={64} color={colors.error} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {error}
                </Text>
                <TouchableOpacity 
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                  onPress={handleRefresh}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : currentPosts.length > 0 ? (
              currentPosts.map((post, index) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onLike={handleLike}
                  onRetweet={handleRetweet}
                />
              ))
            ) : (
              <Animated.View 
                entering={FadeIn.delay(400)}
                style={[styles.emptyState, { backgroundColor: colors.surface }]}
              >
                <MaterialIcons name="inbox" size={64} color={colors.textLight} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No posts available
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
                  Check back later for updates
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  tabContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: 6,
    borderWidth: 1.5,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  activeTab: {
    ...SHADOWS.small,
  },
  tabText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
  },
  feedContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
  emptyState: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xxl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
