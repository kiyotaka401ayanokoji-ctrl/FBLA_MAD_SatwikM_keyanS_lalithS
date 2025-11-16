import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface MerchStoreCardProps {
  onPress: () => void;
  index: number;
}

export default function MerchStoreCard({ onPress, index }: MerchStoreCardProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <BlurView
          intensity={isDarkMode ? 45 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.container, SHADOWS.large]}
        >
          <View
            style={[
              styles.cardInner,
              {
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                borderWidth: 1.5,
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)',
              },
            ]}
          >
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
                <MaterialIcons name="shopping-bag" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.label, { color: colors.textLight }]}>SHOP NOW</Text>
                <Text style={[styles.title, { color: colors.text }]}>Merch Store</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Show your pride! Shop hoodies, tees, accessories & more
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  label: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 12,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
  },
});
