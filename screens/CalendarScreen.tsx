import React, { useState, useRef, useEffect } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Event } from '../types';

interface CalendarScreenProps {
  navigation: any;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, isDarkMode } = useTheme();

  // Background animations
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const circle4Anim = useRef(new Animated.Value(0)).current;
  const circle5Anim = useRef(new Animated.Value(0)).current;
  const circle6Anim = useRef(new Animated.Value(0)).current;

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Event Calendar</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsTimelineView(!isTimelineView)}
        >
          <MaterialIcons 
            name={isTimelineView ? "view-list" : "timeline"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View>
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
      </View>

      {/* Events List or Timeline */}
      {!isTimelineView ? (
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
      ) : (
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timelineContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Timeline Line - More Visible */}
          <View style={[styles.timelineLine, { backgroundColor: isDarkMode ? '#4B5563' : '#94A3B8' }]} />

          {filteredEvents.map((event, index) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              index={index}
              onPress={() => navigation.navigate('EventDetail', { event })}
              colors={colors}
              scrollPosition={scrollPosition}
              isTimelineView={isTimelineView}
            />
          ))}
        </ScrollView>
      )}

      <FloatingTTSButton 
        content={`Event Calendar. ${isTimelineView ? 'Timeline view' : 'List view'}. 
          Current filter: ${selectedFilter === 'all' ? 'All Events' : filters.find(f => f.id === selectedFilter)?.label || selectedFilter}. 
          ${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} found. 
          ${filteredEvents.map(e => `${e.title} on ${e.date}`).join('. ')}`}
      />
    </SafeAreaView>
  );
}

interface TimelineEventCardProps {
  event: Event;
  index: number;
  onPress: () => void;
  colors: any;
  scrollPosition: number;
  isTimelineView: boolean;
}

function TimelineEventCard({ event, index, onPress, colors, scrollPosition, isTimelineView }: TimelineEventCardProps) {
  const isLeft = index % 2 === 0;
  const cardPosition = index * 140;
  const slideAnim = useRef(new Animated.Value(isLeft ? -150 : 150)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(1)).current;
  
  const categoryColors = {
    meeting: colors.info,
    competition: colors.primary,
    workshop: colors.accent,
    social: colors.secondary,
  };
  
  const categoryColor = categoryColors[event.category];

  useEffect(() => {
    // Start animations immediately when timeline view is active
    if (isTimelineView) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 35,
          friction: 8,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 700,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 0,
          duration: 700,
          delay: index * 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isTimelineView, index]);

  return (
    <View 
      style={[styles.timelineEventContainer, isLeft ? styles.timelineLeft : styles.timelineRight]}
    >


      {/* Event Card */}
      <Animated.View 
        style={{
          opacity: opacityAnim,
          transform: [
            { translateX: slideAnim },
            { 
              scale: blurAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.92],
              })
            }
          ],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={[
            styles.timelineCard,
            { 
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor: categoryColor,
            },
            SHADOWS.large,
          ]}
        >
          {/* Title - Centered */}
          <Text style={[styles.timelineTitle, { color: colors.text, textAlign: 'center' }]} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Arrow Pointer */}
          <View 
            style={[
              styles.timelineArrow, 
              { backgroundColor: colors.surface, borderColor: categoryColor },
              isLeft ? styles.timelineArrowLeft : styles.timelineArrowRight,
            ]} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    zIndex: 10,
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
    zIndex: 10,
  },
  filterContainer: {
    marginBottom: SPACING.md,
    zIndex: 10,
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
  
  // Timeline styles
  timelineContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2,
    top: 50,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    opacity: 0.6,
  },
  timelineEventContainer: {
    marginBottom: 40,
    position: 'relative',
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
  },
  timelineLeft: {
    paddingRight: SCREEN_WIDTH / 2 - 10,
    alignItems: 'flex-end',
  },
  timelineRight: {
    paddingLeft: SCREEN_WIDTH / 2 - 10,
    alignItems: 'flex-start',
  },
  timelineDot: {
    position: 'absolute',
    top: 35,
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    paddingVertical: SPACING.lg,
    position: 'relative',
    width: SCREEN_WIDTH / 2 - 20,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineArrow: {
    position: 'absolute',
    top: 32,
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  timelineArrowLeft: {
    right: -6,
  },
  timelineArrowRight: {
    left: -6,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
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
