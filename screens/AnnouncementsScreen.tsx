import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedReanimated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstagramFeed from '../components/InstagramFeed';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { FloatingTTSButton } from '../components/FloatingTTSButton';

type TabType = 'national' | 'chapter';

const TAB_STORAGE_KEY = '@announcements_last_tab';

const NATIONAL_POSTS = [
  'https://www.instagram.com/westcentral.wafbla/p/DQTEL3_EWjS/',
  'https://www.instagram.com/westcentral.wafbla/p/DQZikx8CUur/',
  'https://www.instagram.com/westcentral.wafbla/p/DQK8_x3gXyt/',
];

const CHAPTER_POSTS = [
  'https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/',
  'https://www.instagram.com/fbla.nchs/p/DP1X0WJkXig/',
  'https://www.instagram.com/fbla.nchs/p/DQiEQvRkvjA/',
];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnnouncementsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chapter');
  const { colors, isDarkMode } = useTheme();

  // Background animations
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const circle4Anim = useRef(new Animated.Value(0)).current;
  const circle5Anim = useRef(new Animated.Value(0)).current;
  const circle6Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLastTab();
  }, []);

  useEffect(() => {
    saveLastTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Animate floating circles
    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Anim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(circle1Anim, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Anim, {
          toValue: 1,
          duration: 18000,
          useNativeDriver: true,
        }),
        Animated.timing(circle2Anim, {
          toValue: 0,
          duration: 18000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle3Anim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(circle3Anim, {
          toValue: 0,
          duration: 20000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle4Anim, {
          toValue: 1,
          duration: 22000,
          useNativeDriver: true,
        }),
        Animated.timing(circle4Anim, {
          toValue: 0,
          duration: 22000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle5Anim, {
          toValue: 1,
          duration: 17000,
          useNativeDriver: true,
        }),
        Animated.timing(circle5Anim, {
          toValue: 0,
          duration: 17000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle6Anim, {
          toValue: 1,
          duration: 19000,
          useNativeDriver: true,
        }),
        Animated.timing(circle6Anim, {
          toValue: 0,
          duration: 19000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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

  const currentPosts = activeTab === 'national' ? NATIONAL_POSTS : CHAPTER_POSTS;

  const ttsContent = `
    Announcements Screen.
    Currently viewing ${activeTab === 'national' ? 'Regional' : 'Chapter'} announcements.
    There are ${currentPosts.length} posts displayed.
  `;

  const circle1TranslateY = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 100],
  });

  const circle1TranslateX = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const circle2TranslateY = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, -30],
  });

  const circle2TranslateX = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const circle3TranslateY = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 80],
  });

  const circle3TranslateX = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -30],
  });

  const circle4TranslateY = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, -40],
  });

  const circle4TranslateX = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 35],
  });

  const circle5TranslateY = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 70],
  });

  const circle5TranslateX = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -25],
  });

  const circle6TranslateY = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -20],
  });

  const circle6TranslateX = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 40],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      {/* Floating Background Circles - PASTEL with Dark Mode support */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(221, 214, 254, 0.4)',
            transform: [
              { translateY: circle1TranslateY },
              { translateX: circle1TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(219, 234, 254, 0.4)',
            transform: [
              { translateY: circle2TranslateY },
              { translateX: circle2TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 252, 231, 0.4)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle4,
          {
            backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(252, 231, 243, 0.5)',
            transform: [
              { translateY: circle4TranslateY },
              { translateX: circle4TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle5,
          {
            backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.15)' : 'rgba(254, 243, 199, 0.4)',
            transform: [
              { translateY: circle5TranslateY },
              { translateX: circle5TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle6,
          {
            backgroundColor: isDarkMode ? 'rgba(244, 63, 94, 0.15)' : 'rgba(254, 226, 226, 0.4)',
            transform: [
              { translateY: circle6TranslateY },
              { translateX: circle6TranslateX },
            ],
          },
        ]}
      />

      {/* Small circles */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall1,
          {
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(209, 250, 229, 0.5)',
            transform: [
              { translateY: circle1TranslateY.interpolate({ inputRange: [0, 100], outputRange: [0, -60] }) },
              { translateX: circle1TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall2,
          {
            backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.12)' : 'rgba(250, 232, 255, 0.5)',
            transform: [
              { translateY: circle2TranslateY.interpolate({ inputRange: [-30, 70], outputRange: [70, -30] }) },
              { translateX: circle2TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall3,
          {
            backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.12)' : 'rgba(224, 242, 254, 0.5)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX.interpolate({ inputRange: [-30, 30], outputRange: [40, -20] }) },
            ],
          },
        ]}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Announcements</Text>
      </View>

      <AnimatedReanimated.View entering={FadeInDown.delay(200).springify()} style={styles.tabContainer}>
          <View style={[styles.tabBar, {
            backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.7)' : 'rgba(255, 255, 255, 0.8)',
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
                Regional
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
        </AnimatedReanimated.View>

        <View style={styles.feedContainer}>
          <InstagramFeed postUrls={currentPosts} key={activeTab} />
        </View>

        <FloatingTTSButton content={ttsContent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  tabContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: 6,
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
  // Floating circles - PASTEL COLORS
  floatingCircle: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 0,
  },
  circle1: {
    width: 220,
    height: 220,
    top: 120,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    top: 350,
    left: -70,
  },
  circle3: {
    width: 180,
    height: 180,
    top: 550,
    right: -60,
  },
  circle4: {
    width: 210,
    height: 210,
    top: 700,
    left: -75,
  },
  circle5: {
    width: 190,
    height: 190,
    top: 200,
    left: 50,
  },
  circle6: {
    width: 205,
    height: 205,
    top: 450,
    right: 40,
  },
  // Small circles
  circleSmall1: {
    width: 100,
    height: 100,
    top: 250,
    right: 50,
  },
  circleSmall2: {
    width: 90,
    height: 90,
    top: 480,
    left: 60,
  },
  circleSmall3: {
    width: 110,
    height: 110,
    top: 620,
    left: 40,
  },
});
