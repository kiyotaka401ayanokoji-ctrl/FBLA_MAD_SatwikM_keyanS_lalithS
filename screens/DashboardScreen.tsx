import React, { useEffect, useRef, useState } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated as RNAnimated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents } from '../data/mockData';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const QUOTES = [
  'Connect. Lead. Inspire.',
  'Innovation starts with you.',
  'Building Leaders of Tomorrow.',
  'Connecting Creativity.',
  'Your future begins today.',
];

interface DashboardScreenProps {
  navigation: any;
}

// Helper component functions defined before main component
function QuickActionButton({ icon, color, onPress, colors, isDarkMode }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.quickActionButton}>
      <BlurView 
        intensity={isDarkMode ? 40 : 95} 
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.quickActionBlur, SHADOWS.medium]}
      >
        <View style={[styles.quickActionInner, { 
          borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
          borderWidth: 1.5,
          backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
        }]}>
          <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
            <MaterialIcons name={icon} size={32} color={color} />
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

function AnimatedMembersHubButton({ navigation, colors, isDarkMode, bubbleScale, bubbleRotate }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: bubbleScale.value },
        { rotate: `${bubbleRotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.View entering={FadeInDown.delay(350).springify()}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('MembersHub')}
      >
        <BlurView 
          intensity={isDarkMode ? 45 : 95} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.membersHubCard, SHADOWS.large]}
        >
          <View style={[styles.membersHubCardInner, { 
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.7)', 
            borderWidth: 1.5,
            backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
          }]}>
            <View style={styles.membersHubHeader}>
              <Animated.View style={[styles.membersHubIconContainer, { backgroundColor: colors.secondary }, animatedStyle]}>
                <MaterialIcons name="forum" size={28} color="#FFFFFF" />
              </Animated.View>
              <View style={styles.membersHubHeaderText}>
                <Text style={[styles.membersHubLabel, { color: colors.textLight }]}>
                  CONNECT WITH TEAM
                </Text>
                <Text style={[styles.membersHubTitle, { color: colors.text }]}>
                  Member Hub
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.membersHubDescription, { color: colors.textSecondary }]}>
              Browse all members, search by name or event, and connect with your team
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useSupabaseAuth();
  const { colors, isDarkMode } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const quoteOpacity = useRef(new RNAnimated.Value(1)).current;
  const bubbleScale = useSharedValue(1);
  const bubbleRotate = useSharedValue(0);

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    // Bubble animation
    bubbleScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    bubbleRotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    const quoteInterval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(quoteOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(quoteOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(quoteInterval);
    };
  }, [quoteOpacity, bubbleScale, bubbleRotate]);

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Greeting with Date */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.greetingSection}>
            <View style={styles.greetingRow}>
              <View style={styles.greetingTextContainer}>
                <Text style={[styles.greeting, { color: colors.text }]}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Member'}
                </Text>
                <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
                  Ready to make an impact today?
                </Text>
              </View>
              
              {/* Enhanced Calendar Card with edge glow */}
              <Animated.View entering={FadeIn.delay(300).springify()}>
                <BlurView 
                  intensity={isDarkMode ? 40 : 95} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.dateCard, SHADOWS.medium]}
                >
                  <View style={[styles.dateCardInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                  }]}>
                    <Text style={[styles.dateDay, { color: colors.primary }]}>{dayName}</Text>
                    <Text style={[styles.dateNumber, { color: colors.text }]}>{dayNumber}</Text>
                    <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>{monthName}</Text>
                    <Text style={[styles.dateYear, { color: colors.textLight }]}>{year}</Text>
                  </View>
                </BlurView>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Enhanced Quote Card with luminous edges */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <BlurView 
              intensity={isDarkMode ? 40 : 95} 
              tint={isDarkMode ? 'dark' : 'light'}
              style={[styles.quoteContainer, SHADOWS.medium]}
            >
              <View style={[styles.quoteInner, { 
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                borderWidth: 1.5,
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
              }]}>
                <RNAnimated.View style={{ opacity: quoteOpacity }}>
                  <Text style={[styles.quote, { color: colors.primary }]}>
                    &ldquo;{QUOTES[currentQuoteIndex]}&rdquo;
                  </Text>
                </RNAnimated.View>
                <View style={styles.quoteIndicators}>
                  {QUOTES.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor: index === currentQuoteIndex ? colors.primary : colors.textLight,
                          opacity: index === currentQuoteIndex ? 1 : 0.3,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* AI Coach Button */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AICoach')}
            >
              <BlurView 
                intensity={isDarkMode ? 45 : 95} 
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.aiCoachCard, SHADOWS.large]}
              >
                <View style={[styles.aiCoachCardInner, { 
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.7)', 
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <View style={styles.aiCoachHeader}>
                    <View style={[styles.aiCoachIconContainer, { backgroundColor: colors.accent }]}>
                      <MaterialIcons name="psychology" size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.aiCoachHeaderText}>
                      <Text style={[styles.aiCoachLabel, { color: colors.textLight }]}>
                        NEED GUIDANCE?
                      </Text>
                      <Text style={[styles.aiCoachTitle, { color: colors.text }]}>
                        Ask AI Coach
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.aiCoachDescription, { color: colors.textSecondary }]}>
                    Get personalized advice on leadership, events, and competition prep
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Members Hub Button */}
          <AnimatedMembersHubButton 
            navigation={navigation} 
            colors={colors} 
            isDarkMode={isDarkMode}
            bubbleScale={bubbleScale}
            bubbleRotate={bubbleRotate}
          />

          {/* Enhanced Upcoming Event with defined glass */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <BlurView 
                  intensity={isDarkMode ? 45 : 95} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.eventCard, SHADOWS.large]}
                >
                  <View style={[styles.eventCardInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                  }]}>
                    <View style={styles.eventHeader}>
                      <View style={[styles.eventIconContainer, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="event" size={24} color="#FFFFFF" />
                      </View>
                      <View style={styles.eventHeaderText}>
                        <Text style={[styles.eventLabel, { color: colors.textLight }]}>
                          NEXT EVENT
                        </Text>
                        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                          {upcomingEvent.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="calendar-today" size={16} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.date}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Enhanced Notifications Strip */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Announcements')}
            >
              <BlurView 
                intensity={isDarkMode ? 40 : 95} 
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.notificationStrip, SHADOWS.small]}
              >
                <View style={[styles.notificationInner, { 
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <View style={[styles.notificationDot, { backgroundColor: colors.secondary }]} />
                  <Text style={[styles.notificationText, { color: colors.text }]}>
                    1 new announcement
                  </Text>
                  <MaterialIcons name="chevron-right" size={20} color={colors.textLight} />
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions - Centered Header */}
          <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickActionButton
                icon="event"
                color={colors.primary}
                onPress={() => navigation.navigate('Calendar')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="article"
                color={colors.secondary}
                onPress={() => navigation.navigate('Announcements')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="folder"
                color={colors.accent}
                onPress={() => navigation.navigate('Resources')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            </View>
          </Animated.View>

          {/* Social Media Section - Centered Header with Perfect Alignment */}
          <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect With Us</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                onPress={() => openSocialMedia('https://www.instagram.com/fbla_pbl/')}
                activeOpacity={0.85}
                style={styles.socialButtonWrapper}
              >
                <BlurView 
                  intensity={isDarkMode ? 25 : 85} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.socialButton, SHADOWS.medium]}
                >
                  <View style={[styles.socialButtonInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)'
                  }]}>
                    <LinearGradient
                      colors={['#833AB4', '#FD1D1D', '#F77737']}
                      style={styles.socialIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.socialLabel, { color: colors.text }]}>Instagram</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openSocialMedia('https://twitter.com/FBLA_PBL')}
                activeOpacity={0.85}
                style={styles.socialButtonWrapper}
              >
                <BlurView 
                  intensity={isDarkMode ? 25 : 85} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.socialButton, SHADOWS.medium]}
                >
                  <View style={[styles.socialButtonInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                  }]}>
                    <View style={[styles.socialIconGradient, { backgroundColor: '#1DA1F2' }]}>
                      <MaterialIcons name="tag" size={24} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.socialLabel, { color: colors.text }]}>Twitter/X</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
        
        {/* Floating TTS Button */}
        <FloatingTTSButton 
          content={`Dashboard. Welcome back ${user?.name?.split(' ')[0] || 'Member'}. 
            ${QUOTES[currentQuoteIndex]}. 
            ${upcomingEvent ? `Next event: ${upcomingEvent.title} on ${upcomingEvent.date} at ${upcomingEvent.time}` : 'No upcoming events'}. 
            You have 1 new announcement.`}
        />
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  greetingSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 16,
  },
  dateCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  dateCardInner: {
    padding: SPACING.md,
    width: 78,
    alignItems: 'center',
    borderRadius: 20,
  },
  dateDay: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dateNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  dateMonth: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  dateYear: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '500',
  },
  quoteContainer: {
    borderRadius: 22,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  quoteInner: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: 22,
  },
  quote: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  quoteIndicators: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventCard: {
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  eventCardInner: {
    padding: SPACING.lg,
    borderRadius: 26,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  eventHeaderText: {
    flex: 1,
  },
  eventLabel: {
    ...TYPOGRAPHY.captionBold,
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  eventDetails: {
    gap: SPACING.sm,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  eventDetailText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  notificationStrip: {
    borderRadius: 20,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  notificationInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 20,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  notificationText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
    fontWeight: '500',
  },
  quickActionsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  quickActionButton: {
    width: 88,
    height: 88,
  },
  quickActionBlur: {
    borderRadius: 24,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  quickActionInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  quickActionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialSection: {
    marginBottom: SPACING.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  socialButtonWrapper: {
    flex: 1,
  },
  socialButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  socialButtonInner: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: 24,
  },
  socialIconGradient: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  socialLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  aiCoachCard: {
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  aiCoachCardInner: {
    padding: SPACING.lg,
    borderRadius: 26,
  },
  aiCoachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  aiCoachIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  aiCoachHeaderText: {
    flex: 1,
  },
  aiCoachLabel: {
    ...TYPOGRAPHY.captionBold,
    marginBottom: SPACING.xs,
  },
  aiCoachTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
  },
  aiCoachDescription: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
  membersHubCard: {
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  membersHubCardInner: {
    padding: SPACING.lg,
    borderRadius: 26,
  },
  membersHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  membersHubIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  membersHubHeaderText: {
    flex: 1,
  },
  membersHubLabel: {
    ...TYPOGRAPHY.captionBold,
    marginBottom: SPACING.xs,
  },
  membersHubTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
  },
  membersHubDescription: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
});