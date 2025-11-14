import React, { useState } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Event } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { showCalendarOptions } from '../utils/calendar';

interface EventDetailScreenProps {
  route: {
    params: {
      event: Event;
    };
  };
  navigation: any;
}

export default function EventDetailScreen({ route, navigation }: EventDetailScreenProps) {
  const { event } = route.params;
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);
  const { colors, isDarkMode } = useTheme();
  
  const categoryColors = {
    meeting: colors.info,
    competition: colors.primary,
    workshop: colors.accent,
    social: colors.secondary,
  };
  
  const categoryColor = categoryColors[event.category];

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    Alert.alert(
      isRegistered ? 'Unregistered' : 'Registered!',
      isRegistered 
        ? `You have been unregistered from "${event.title}"`
        : `You are now registered for "${event.title}"`,
      [{ text: 'OK' }]
    );
  };

  const handleAddToCalendar = () => {
    showCalendarOptions(event);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Event Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Event Header */}
        <Animated.View 
          entering={FadeIn.duration(600)} 
          style={[styles.eventHeader, { backgroundColor: colors.surface, borderTopColor: categoryColor }, SHADOWS.large]}
        >
          <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {event.category.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
        </Animated.View>

        {/* Event Info */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()} 
          style={[styles.infoCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="calendar-today" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Date</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="access-time" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Time</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="location-on" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Location</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="people" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Attendees</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.attendees} registered</Text>
            </View>
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()} 
          style={[styles.descriptionCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Event</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()} 
          style={styles.actionButtons}
        >
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              SHADOWS.medium,
              { backgroundColor: isRegistered ? colors.error : categoryColor }
            ]}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isRegistered ? 'cancel' : 'check-circle'} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.registerButtonText}>
              {isRegistered ? 'Unregister' : 'Register Now'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.calendarButton, { backgroundColor: colors.surface }, SHADOWS.medium]}
            activeOpacity={0.8}
            onPress={handleAddToCalendar}
          >
            <MaterialIcons name="event" size={24} color={categoryColor} />
            <Text style={[styles.calendarButtonText, { color: categoryColor }]}>
              Add to Calendar
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
      </ScrollView>
      <FloatingTTSButton 
        content={`Event Details. 
          ${event.title}. 
          Category: ${event.category}. 
          Date: ${event.date}. 
          Time: ${event.time}. 
          Location: ${event.location}. 
          Attendees: ${event.attendees} registered. 
          Description: ${event.description}. 
          You are ${isRegistered ? 'registered' : 'not registered'} for this event.`}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
  },
  shareButton: {
    padding: SPACING.xs,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  eventHeader: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderTopWidth: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  eventTitle: {
    ...TYPOGRAPHY.h2,
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  descriptionCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    lineHeight: 24,
  },
  actionButtons: {
    gap: SPACING.md,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  registerButtonText: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  calendarButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
});
