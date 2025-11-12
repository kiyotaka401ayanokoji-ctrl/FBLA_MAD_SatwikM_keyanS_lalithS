import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InstagramPostCard from './InstagramPostCard';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const { colors } = useTheme();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="photo-camera" size={28} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Instagram Feed
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
          Latest posts from @fbla.nchs
        </Text>
      </View>

      {/* Posts */}
      {postUrls.map((url, index) => (
        <InstagramPostCard 
          key={index} 
          postUrl={url}
          username="@fbla.nchs"
        />
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textLight }]}>
          Tap any post to view on Instagram
        </Text>
      </View>
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
  header: {
    marginBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginLeft: SPACING.sm,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
  },
});