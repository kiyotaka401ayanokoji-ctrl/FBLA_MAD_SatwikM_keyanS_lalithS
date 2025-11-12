import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

// Web fallback component - directs users to Instagram
export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const { colors } = useTheme();

  const handleOpenInstagram = async () => {
    try {
      await Linking.openURL('https://www.instagram.com/fbla.nchs/');
    } catch (error) {
      console.error('Error opening Instagram:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>
          Follow us on Instagram @fbla.nchs 📸
        </Text>
      </View>

      {/* Web Fallback Content */}
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="photo-library" size={64} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            View our latest posts
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Instagram embeds are best viewed in our mobile app.
            {'\n'}
            Click below to visit our Instagram page directly!
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleOpenInstagram}
            activeOpacity={0.8}
          >
            <MaterialIcons name="open-in-new" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Open Instagram</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  buttonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
