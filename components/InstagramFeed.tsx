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

  // Extract username from the first post URL
  const extractUsername = (url: string): string => {
    const match = url.match(/instagram\.com\/([^\/]+)/);
    return match ? `@${match[1]}` : '@fbla.nchs';
  };

  const username = postUrls.length > 0 ? extractUsername(postUrls[0]) : '@fbla.nchs';

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Posts */}
      {postUrls.map((url, index) => (
        <InstagramPostCard 
          key={index} 
          postUrl={url}
          username={username}
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
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
  },
});