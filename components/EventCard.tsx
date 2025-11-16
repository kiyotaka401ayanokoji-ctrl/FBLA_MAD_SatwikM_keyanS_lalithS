import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Event } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  index: number;
}

const categoryIcons = {
  meeting: 'groups' as const,
  competition: 'emoji-events' as const,
  workshop: 'school' as const,
  social: 'celebration' as const,
};

export default function EventCard({ event, onPress, index }: EventCardProps) {
  const { colors, isDarkMode } = useTheme();
  
  const categoryColors = {
    meeting: colors.info,
    competition: colors.primary,
    workshop: colors.accent,
    social: colors.secondary,
  };
  
  const categoryColor = categoryColors[event.category];
  const categoryIcon = categoryIcons[event.category];

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.85}
      >
        <BlurView 
          intensity={isDarkMode ? 45 : 95} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.container, SHADOWS.large]}
        >
          <View style={[styles.cardInner, { 
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
            borderWidth: 1.5,
            backgroundColor: 'transparent'
          }]}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <MaterialIcons name={categoryIcon} size={20} color="#FFFFFF" />
            </View>
            
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{event.title}</Text>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="calendar-today" size={14} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.date}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={14} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.time}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>{event.location}</Text>
              </View>
              
              <View style={[styles.footer, { borderTopColor: colors.divider }]}>
                <View style={styles.attendeesContainer}>
                  <MaterialIcons name="people" size={16} color={colors.textLight} />
                  <Text style={[styles.attendeesText, { color: colors.textLight }]}>{event.attendees} attending</Text>
                </View>
                
                {event.isRegistered && (
                  <View style={[styles.registeredBadge, { backgroundColor: colors.success + '20' }]}>
                    <MaterialIcons name="check-circle" size={14} color={colors.success} />
                    <Text style={[styles.registeredText, { color: colors.success }]}>Registered</Text>
                  </View>
                )}
              </View>
            </View>
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
  categoryBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    paddingRight: 52,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  registeredText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});
