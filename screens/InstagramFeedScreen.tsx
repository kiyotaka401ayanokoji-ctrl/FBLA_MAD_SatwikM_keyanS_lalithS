import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import InstagramEmbed from '../components/InstagramEmbed';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// 🔥 UPDATE THESE POST URLS WHENEVER YOU WANT TO SHOW NEW POSTS!
const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/EXAMPLE1/',
  'https://www.instagram.com/p/EXAMPLE2/',
  'https://www.instagram.com/p/EXAMPLE3/',
  // Add more post URLs here as needed
];

export default function InstagramFeedScreen() {
  const { colors, isDarkMode } = useTheme();

  const handleFollowInstagram = async () => {
    try {
      await Linking.openURL('https://www.instagram.com/fbla.nchs/');
    } catch (error) {
      console.error('Error opening Instagram:', error);
    }
  };

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
          <View style={styles.headerContent}>
            <MaterialIcons name="camera-alt" size={28} color={colors.primary} />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Follow us on Instagram
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
                @fbla.nchs 📸
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.followButton, { backgroundColor: colors.primary }]}
            onPress={handleFollowInstagram}
            activeOpacity={0.8}
          >
            <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Instagram Feed */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContainer}
        >
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            {INSTAGRAM_POSTS.length > 0 ? (
              INSTAGRAM_POSTS.map((postUrl, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInDown.delay(300 + (index * 100)).springify()}
                >
                  <InstagramEmbed postUrl={postUrl} />
                </Animated.View>
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                <MaterialIcons name="photo-library" size={64} color={colors.textLight} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No posts yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
                  Check back soon for updates!
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 2,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
    ...SHADOWS.small,
  },
  followButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 100,
    alignItems: 'center',
  },
  emptyState: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.xxl,
    ...SHADOWS.medium,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
});