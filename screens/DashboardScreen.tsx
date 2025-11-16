import React, { useEffect, useRef, useState } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents } from '../data/mockData';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import MerchStoreCard from '../components/MerchStoreCard';


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
        intensity={isDarkMode ? 40 : 60} 
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.quickActionBlur, SHADOWS.medium]}
      >
        <View style={[styles.quickActionInner, { 
          borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
          borderWidth: 1.5,
          backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
        }]}>
          <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
            <MaterialIcons name={icon} size={32} color={color} />
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

function AnimatedMembersHubButton({ navigation, colors, isDarkMode }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(350).springify()}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('MembersHub')}
      >
        <BlurView 
          intensity={isDarkMode ? 45 : 60} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.membersHubCard, SHADOWS.large]}
        >
          <View style={[styles.membersHubCardInner, { 
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)', 
            borderWidth: 1.5,
            backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)'
          }]}>
            <View style={styles.membersHubHeader}>
              <View style={[styles.membersHubIconContainer, { backgroundColor: colors.secondary }]}>
                <MaterialIcons name="forum" size={28} color="#FFFFFF" />
              </View>
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
  // Background animations
  const circle1Anim = useRef(new RNAnimated.Value(0)).current;
  const circle2Anim = useRef(new RNAnimated.Value(0)).current;
  const circle3Anim = useRef(new RNAnimated.Value(0)).current;
  const circle4Anim = useRef(new RNAnimated.Value(0)).current;
  const circle5Anim = useRef(new RNAnimated.Value(0)).current;
  const circle6Anim = useRef(new RNAnimated.Value(0)).current;

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    // Animate floating circles
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle1Anim, {
          toValue: 1,
          duration: 16000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle1Anim, {
          toValue: 0,
          duration: 16000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle2Anim, {
          toValue: 1,
          duration: 19000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle2Anim, {
          toValue: 0,
          duration: 19000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle3Anim, {
          toValue: 1,
          duration: 21000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle3Anim, {
          toValue: 0,
          duration: 21000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle4Anim, {
          toValue: 1,
          duration: 23000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle4Anim, {
          toValue: 0,
          duration: 23000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle5Anim, {
          toValue: 1,
          duration: 18000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle5Anim, {
          toValue: 0,
          duration: 18000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circle6Anim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circle6Anim, {
          toValue: 0,
          duration: 20000,
          useNativeDriver: true,
        }),
      ])
    ).start();

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
  }, [quoteOpacity, circle1Anim, circle2Anim, circle3Anim, circle4Anim, circle5Anim, circle6Anim]);

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();

  const circle1TranslateY = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 120],
  });

  const circle1TranslateX = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 60],
  });

  const circle2TranslateY = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, -40],
  });

  const circle2TranslateX = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -50],
  });

  const circle3TranslateY = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 90],
  });

  const circle3TranslateX = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 40],
  });

  const circle4TranslateY = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [70, -50],
  });

  const circle4TranslateX = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 45],
  });

  const circle5TranslateY = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 80],
  });

  const circle5TranslateX = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -35],
  });

  const circle6TranslateY = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, -30],
  });

  const circle6TranslateX = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 50],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      {/* Floating Background Circles - PASTEL with Dark Mode support */}
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(221, 214, 254, 0.35)',
            transform: [
              { translateY: circle1TranslateY },
              { translateX: circle1TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.12)' : 'rgba(219, 234, 254, 0.35)',
            transform: [
              { translateY: circle2TranslateY },
              { translateX: circle2TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.12)' : 'rgba(220, 252, 231, 0.35)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle4,
          {
            backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.12)' : 'rgba(252, 231, 243, 0.4)',
            transform: [
              { translateY: circle4TranslateY },
              { translateX: circle4TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle5,
          {
            backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.12)' : 'rgba(254, 243, 199, 0.35)',
            transform: [
              { translateY: circle5TranslateY },
              { translateX: circle5TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circle6,
          {
            backgroundColor: isDarkMode ? 'rgba(244, 63, 94, 0.12)' : 'rgba(254, 226, 226, 0.35)',
            transform: [
              { translateY: circle6TranslateY },
              { translateX: circle6TranslateX },
            ],
          },
        ]}
      />

      {/* Small circles */}
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall1,
          {
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(209, 250, 229, 0.45)',
            transform: [
              { translateY: circle1TranslateY.interpolate({ inputRange: [0, 120], outputRange: [0, -70] }) },
              { translateX: circle1TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall2,
          {
            backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(250, 232, 255, 0.45)',
            transform: [
              { translateY: circle2TranslateY.interpolate({ inputRange: [-40, 80], outputRange: [80, -40] }) },
              { translateX: circle2TranslateX },
            ],
          },
        ]}
      />
      <RNAnimated.View
        style={[
          styles.floatingCircle,
          styles.circleSmall3,
          {
            backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(224, 242, 254, 0.45)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX.interpolate({ inputRange: [-40, 40], outputRange: [50, -30] }) },
            ],
          },
        ]}
      />

      <View style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Greeting with Date */}
          <View style={styles.greetingSection}>
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
                  intensity={isDarkMode ? 40 : 60} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.dateCard, SHADOWS.medium]}
                >
                  <View style={[styles.dateCardInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
                  }]}>
                    <Text style={[styles.dateDay, { color: colors.primary }]}>{dayName}</Text>
                    <Text style={[styles.dateNumber, { color: colors.text }]}>{dayNumber}</Text>
                    <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>{monthName}</Text>
                    <Text style={[styles.dateYear, { color: colors.textLight }]}>{year}</Text>
                  </View>
                </BlurView>
              </Animated.View>
            </View>
          </View>

          {/* Enhanced Quote Card with luminous edges */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <BlurView 
              intensity={isDarkMode ? 40 : 60} 
              tint={isDarkMode ? 'dark' : 'light'}
              style={[styles.quoteContainer, SHADOWS.medium]}
            >
              <View style={[styles.quoteInner, { 
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                borderWidth: 1.5,
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
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
                intensity={isDarkMode ? 45 : 60} 
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.aiCoachCard, SHADOWS.large]}
              >
                <View style={[styles.aiCoachCardInner, { 
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)', 
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)'
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
          />



          {/* Enhanced Upcoming Event with defined glass */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <BlurView 
                  intensity={isDarkMode ? 45 : 60} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.eventCard, SHADOWS.large]}
                >
                  <View style={[styles.eventCardInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.25)'
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

          <MerchStoreCard
  onPress={() => navigation.navigate('MerchStore')}
  index={0}
/>

          

          {/* Enhanced Notifications Strip */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Announcements')}
            >
              <BlurView 
                intensity={isDarkMode ? 40 : 60} 
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.notificationStrip, SHADOWS.small]}
              >
                <View style={[styles.notificationInner, { 
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
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
                  intensity={isDarkMode ? 25 : 50} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.socialButton, SHADOWS.medium]}
                >
                  <View style={[styles.socialButtonInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.2)'
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
                  intensity={isDarkMode ? 25 : 50} 
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.socialButton, SHADOWS.medium]}
                >
                  <View style={[styles.socialButtonInner, { 
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)', 
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.2)'
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
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
  // Floating circles - PASTEL COLORS
  floatingCircle: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 0,
  },
  circle1: {
    width: 240,
    height: 240,
    top: 100,
    right: -90,
  },
  circle2: {
    width: 220,
    height: 220,
    top: 320,
    left: -80,
  },
  circle3: {
    width: 200,
    height: 200,
    top: 520,
    right: -70,
  },
  circle4: {
    width: 230,
    height: 230,
    top: 670,
    left: -85,
  },
  circle5: {
    width: 210,
    height: 210,
    top: 150,
    left: 30,
  },
  circle6: {
    width: 225,
    height: 225,
    top: 400,
    right: 20,
  },
  // Small circles
  circleSmall1: {
    width: 110,
    height: 110,
    top: 220,
    right: 30,
  },
  circleSmall2: {
    width: 100,
    height: 100,
    top: 440,
    left: 50,
  },
  circleSmall3: {
    width: 120,
    height: 120,
    top: 580,
    left: 20,
  },
});