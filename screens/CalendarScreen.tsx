import React, { useState } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CalendarScreenProps {
  navigation: any;
}

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const filters = [
    { id: 'all', label: 'All Events', icon: 'event' as const },
    { id: 'meeting', label: 'Meetings', icon: 'groups' as const },
    { id: 'competition', label: 'Competitions', icon: 'emoji-events' as const },
    { id: 'workshop', label: 'Workshops', icon: 'school' as const },
    { id: 'social', label: 'Social', icon: 'celebration' as const },
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === selectedFilter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Event Calendar</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <Animated.View entering={FadeIn.duration(600)}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                { backgroundColor: selectedFilter === filter.id ? colors.primary : colors.surface },
                SHADOWS.small,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={filter.icon} 
                size={18} 
                color={selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary },
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Events List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        <Text style={[styles.resultsText, { color: colors.textLight }]}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </Text>
        
        {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate('EventDetail', { event })}
            index={index}
          />
        ))}
      </ScrollView>
      <FloatingTTSButton 
        content={`Event Calendar. 
          Current filter: ${selectedFilter === 'all' ? 'All Events' : filters.find(f => f.id === selectedFilter)?.label || selectedFilter}. 
          ${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} found. 
          ${filteredEvents.map(e => `${e.title} on ${e.date}`).join('. ')}`}
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
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: SPACING.md,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  filterText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  eventsContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
  resultsText: {
    ...TYPOGRAPHY.bodySmall,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
});
