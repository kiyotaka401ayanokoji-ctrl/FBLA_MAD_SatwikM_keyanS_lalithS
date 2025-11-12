import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstagramFeed from '../components/InstagramFeed';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type TabType = 'national' | 'chapter';

const TAB_STORAGE_KEY = '@announcements_last_tab';

// 🔥 UPDATE THESE POST URLS WHENEVER YOU WANT TO SHOW NEW POSTS!
const NATIONAL_POSTS = [
  'https://www.instagram.com/fbla_pbl/p/DDwZxqhSaVu/',
  'https://www.instagram.com/fbla_pbl/p/DDtxqJOyqHN/',
  'https://www.instagram.com/fbla_pbl/p/DDrJCqhSqmH/',
];

const CHAPTER_POSTS = [
  'https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/',
  'https://www.instagram.com/fbla.nchs/p/DP1X0WJkXig/',
  'https://www.instagram.com/fbla.nchs/p/DQiEQvRkvjA/',
];

export default function AnnouncementsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chapter');
  const { colors, isDarkMode } = useTheme();

  // Load last tab on mount
  useEffect(() => {
    loadLastTab();
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

  const handleFollowInstagram = async () => {
    const username = activeTab === 'national' ? 'fbla_pbl' : 'fbla.nchs';
    try {
      await Linking.openURL(`https://www.instagram.com/${username}/`);
    } catch (error) {
      console.error('Error opening Instagram:', error);
    }
  };

  const instagramHandle = activeTab === 'national' ? '@fbla_pbl' : '@fbla.nchs';
  const currentPosts = activeTab === 'national' ? NATIONAL_POSTS : CHAPTER_POSTS;

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
              Live from Instagram {instagramHandle} 📸
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.followButton, { backgroundColor: colors.primary }]}
            onPress={handleFollowInstagram}
            activeOpacity={0.8}
          >
            <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
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
                National
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
                Chapter
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Instagram Feed - Shows REAL embedded posts */}
        <View style={styles.feedContainer}>
          <InstagramFeed postUrls={currentPosts} key={activeTab} />
        </View>
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
  followButton: {
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
  feedContainer: {
    flex: 1,
  },
});
