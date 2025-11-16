import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AnimatedReanimated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { FloatingTTSButton } from '../components/FloatingTTSButton';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExecDashboardProps {
  navigation: any;
}

export default function ExecDashboard({ navigation }: ExecDashboardProps) {
  const { colors, isDarkMode } = useTheme();

  // Background animations
  const circle1Anim = React.useRef(new Animated.Value(0)).current;
  const circle2Anim = React.useRef(new Animated.Value(0)).current;
  const circle3Anim = React.useRef(new Animated.Value(0)).current;
  const circle4Anim = React.useRef(new Animated.Value(0)).current;
  const circle5Anim = React.useRef(new Animated.Value(0)).current;
  const circle6Anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

  const ttsContent = `
    Executive Dashboard.
    Welcome to the Executive Member dashboard.
    You have access to three management tools: Announcements Manager, Events Manager, and Resources Manager.
  `;

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
              { translateY: circle1TranslateY.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
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
              { translateY: circle2TranslateY.interpolate({ inputRange: [0, 1], outputRange: [70, -30] }) },
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
              { translateX: circle3TranslateX.interpolate({ inputRange: [0, 1], outputRange: [40, -20] }) },
            ],
          },
        ]}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Executive Dashboard</Text>
      </View>

      <View style={styles.content}>
        <AnimatedReanimated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Welcome to your executive management tools
          </Text>
        </AnimatedReanimated.View>

        <View style={styles.featuresGrid}>
          <AnimatedReanimated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AnnouncementsManager')}
              style={styles.featureCard}
            >
              <BlurView
                intensity={isDarkMode ? 45 : 60}
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.featureBlur, SHADOWS.large]}
              >
                <View style={[styles.featureInner, {
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
                }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialIcons name="campaign" size={32} color={colors.primary} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>Announcements</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                    Add, edit, and delete chapter announcements
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </AnimatedReanimated.View>

          <AnimatedReanimated.View entering={FadeInDown.delay(400).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('EventsManager')}
              style={styles.featureCard}
            >
              <BlurView
                intensity={isDarkMode ? 45 : 60}
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.featureBlur, SHADOWS.large]}
              >
                <View style={[styles.featureInner, {
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
                }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
                    <MaterialIcons name="event" size={32} color={colors.secondary} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>Events</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                    Manage calendar events and schedules
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </AnimatedReanimated.View>

          <AnimatedReanimated.View entering={FadeInDown.delay(500).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ResourcesManager')}
              style={styles.featureCard}
            >
              <BlurView
                intensity={isDarkMode ? 45 : 60}
                tint={isDarkMode ? 'dark' : 'light'}
                style={[styles.featureBlur, SHADOWS.large]}
              >
                <View style={[styles.featureInner, {
                  borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 1.5,
                  backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)'
                }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.accent + '20' }]}>
                    <MaterialIcons name="folder" size={32} color={colors.accent} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>Resources</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                    Upload and manage chapter resources
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </AnimatedReanimated.View>
        </View>
      </View>

      <FloatingTTSButton content={ttsContent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  welcomeText: {
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  featuresGrid: {
    flex: 1,
    gap: SPACING.lg,
  },
  featureCard: {
    flex: 1,
  },
  featureBlur: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  featureInner: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  featureTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  featureSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
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
