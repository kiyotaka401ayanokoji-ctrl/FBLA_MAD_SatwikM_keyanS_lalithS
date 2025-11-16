import React, { useState, useRef, useEffect } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface Resource {
  id: string;
  title: string;
  url: string;
  category: 'rubric' | 'official';
}

const EVENT_RUBRICS: Resource[] = [
  {
    id: 'r1',
    title: 'Accounting',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Objective%20Tests/Accounting.pdf',
    category: 'rubric',
  },
  {
    id: 'r2',
    title: 'Advertising',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Objective%20Tests/Advertising.pdf',
    category: 'rubric',
  },
  {
    id: 'r3',
    title: 'Agribusiness',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Objective%20Tests/Agribusiness.pdf',
    category: 'rubric',
  },
  {
    id: 'r4',
    title: 'Banking & Financial Systems',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Role%20Play%20Events/Banking-and-Financial-Systems.pdf',
    category: 'rubric',
  },
  {
    id: 'r5',
    title: 'Broadcast Journalism',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Broadcast-Journalism.pdf',
    category: 'rubric',
  },
  {
    id: 'r6',
    title: 'Business Communication',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Objective%20Tests/Business-Communication.pdf',
    category: 'rubric',
  },
  {
    id: 'r7',
    title: 'Business Plan',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Business-Plan.pdf',
    category: 'rubric',
  },
  {
    id: 'r8',
    title: 'Career Portfolio',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Career-Portfolio.pdf',
    category: 'rubric',
  },
  {
    id: 'r9',
    title: 'Coding & Programming',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Coding-and-Programming.pdf',
    category: 'rubric',
  },
  {
    id: 'r10',
    title: 'Community Service Project',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Chapter%20Events/Community-Service-Project.pdf',
    category: 'rubric',
  },
  {
    id: 'r11',
    title: 'Data Science & AI',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Objective%20Tests/Data-Science-and-AI.pdf',
    category: 'rubric',
  },
  {
    id: 'r12',
    title: 'Digital Animation',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Digital-Animation.pdf',
    category: 'rubric',
  },
  {
    id: 'r13',
    title: 'Financial Statement Analysis',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Financial-Statement-Analysis.pdf',
    category: 'rubric',
  },
  {
    id: 'r14',
    title: 'Marketing',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Role%20Play%20Events/Marketing.pdf',
    category: 'rubric',
  },
  {
    id: 'r15',
    title: 'Mobile Application Development',
    url: 'https://connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Mobile-Application-Development.pdf',
    category: 'rubric',
  },
];

const OFFICIAL_RESOURCES: Resource[] = [
  {
    id: 'o1',
    title: 'FBLA Membership',
    url: 'https://www.fbla.org/high-school/membership/',
    category: 'official',
  },
  {
    id: 'o2',
    title: 'Scholarships & Aid',
    url: 'https://www.fbla.org/high-school/hs-scholarships-aid/',
    category: 'official',
  },
  {
    id: 'o3',
    title: 'Education Programs',
    url: 'https://www.fbla.org/high-school/education-programs/',
    category: 'official',
  },
  {
    id: 'o4',
    title: 'Official FBLA Website',
    url: 'https://www.fbla.org/',
    category: 'official',
  },
];



export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
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
          duration: 14000,
          useNativeDriver: true,
        }),
        Animated.timing(circle1Anim, {
          toValue: 0,
          duration: 14000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Anim, {
          toValue: 1,
          duration: 17000,
          useNativeDriver: true,
        }),
        Animated.timing(circle2Anim, {
          toValue: 0,
          duration: 17000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle3Anim, {
          toValue: 1,
          duration: 19500,
          useNativeDriver: true,
        }),
        Animated.timing(circle3Anim, {
          toValue: 0,
          duration: 19500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle4Anim, {
          toValue: 1,
          duration: 21500,
          useNativeDriver: true,
        }),
        Animated.timing(circle4Anim, {
          toValue: 0,
          duration: 21500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle5Anim, {
          toValue: 1,
          duration: 16500,
          useNativeDriver: true,
        }),
        Animated.timing(circle5Anim, {
          toValue: 0,
          duration: 16500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle6Anim, {
          toValue: 1,
          duration: 18500,
          useNativeDriver: true,
        }),
        Animated.timing(circle6Anim, {
          toValue: 0,
          duration: 18500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [circle1Anim, circle2Anim, circle3Anim, circle4Anim, circle5Anim, circle6Anim]);

  const handleOpenResource = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const filterResources = (resources: Resource[]) => {
    if (!searchQuery.trim()) return resources;
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredRubrics = filterResources(EVENT_RUBRICS);
  const filteredOfficial = filterResources(OFFICIAL_RESOURCES);

  const circle1TranslateY = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 90],
  });

  const circle1TranslateX = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 45],
  });

  const circle2TranslateY = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [90, -50],
  });

  const circle2TranslateX = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -35],
  });

  const circle3TranslateY = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 70],
  });

  const circle3TranslateX = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [25, -25],
  });

  const circle4TranslateY = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [55, -35],
  });

  const circle4TranslateX = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 30],
  });

  const circle5TranslateY = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 65],
  });

  const circle5TranslateX = circle5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [35, -20],
  });

  const circle6TranslateY = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [45, -25],
  });

  const circle6TranslateX = circle6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 35],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      {/* Floating Background Circles - PASTEL with Dark Mode support */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.18)' : 'rgba(221, 214, 254, 0.45)',
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
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.18)' : 'rgba(219, 234, 254, 0.45)',
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
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.18)' : 'rgba(220, 252, 231, 0.45)',
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
            backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.18)' : 'rgba(252, 231, 243, 0.5)',
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
            backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.18)' : 'rgba(254, 243, 199, 0.45)',
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
            backgroundColor: isDarkMode ? 'rgba(244, 63, 94, 0.18)' : 'rgba(254, 226, 226, 0.45)',
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
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.14)' : 'rgba(209, 250, 229, 0.55)',
            transform: [
              { translateY: circle1TranslateY.interpolate({ inputRange: [0, 90], outputRange: [0, -55] }) },
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
            backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.14)' : 'rgba(250, 232, 255, 0.55)',
            transform: [
              { translateY: circle2TranslateY.interpolate({ inputRange: [-50, 90], outputRange: [90, -50] }) },
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
            backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.14)' : 'rgba(224, 242, 254, 0.55)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX.interpolate({ inputRange: [-25, 25], outputRange: [35, -15] }) },
            ],
          },
        ]}
      />

      <View style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.searchContainer}>
          <BlurView 
            intensity={isDarkMode ? 40 : 95} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.searchBlur, SHADOWS.medium]}
          >
            <View style={[styles.searchInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <MaterialIcons name="search" size={22} color={colors.textLight} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search resources..."
                placeholderTextColor={colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={20} color={colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </Animated.View>

        {/* Scrollable Content */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Event Rubrics & Guides Section */}
          {filteredRubrics.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="description" size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Event Rubrics & Guides
                </Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {filteredRubrics.length} {filteredRubrics.length === 1 ? 'guide' : 'guides'} available
              </Text>

              {filteredRubrics.map((resource, index) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onPress={() => handleOpenResource(resource.url)}
                  index={index}
                  colors={colors}
                  isDarkMode={isDarkMode}
                  isOfficial={false}
                />
              ))}
            </Animated.View>
          )}

          {/* Official FBLA Resources Section */}
          {filteredOfficial.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <View style={[styles.sectionHeader, styles.officialSectionHeader]}>
                <MaterialIcons name="verified" size={24} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Official FBLA Resources
                </Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {filteredOfficial.length} official {filteredOfficial.length === 1 ? 'link' : 'links'}
              </Text>

              {filteredOfficial.map((resource, index) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onPress={() => handleOpenResource(resource.url)}
                  index={index}
                  colors={colors}
                  isDarkMode={isDarkMode}
                  isOfficial={true}
                />
              ))}
            </Animated.View>
          )}

          {/* No Results */}
          {filteredRubrics.length === 0 && filteredOfficial.length === 0 && (
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.noResults}>
              <MaterialIcons name="search-off" size={64} color={colors.textLight} />
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                No resources found for &quot;{searchQuery}&quot;
              </Text>
            </Animated.View>
          )}
        </ScrollView>
       {/* Floating TTS Button */}
        <FloatingTTSButton
          content={`Resources Screen.
            ${filteredRubrics.length} event rubrics and guides available.
            ${filteredOfficial.length} official FBLA resources available.
            ${searchQuery ? `Currently searching for: ${searchQuery}` : ''}`}
        />
      </View>
    </SafeAreaView>
  );
}

interface ResourceItemProps {
  resource: Resource;
  onPress: () => void;
  index: number;
  colors: any;
  isDarkMode: boolean;
  isOfficial: boolean;
}

function ResourceItem({ resource, onPress, index, colors, isDarkMode, isOfficial }: ResourceItemProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <BlurView 
          intensity={isDarkMode ? 40 : 95} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.resourceCard, SHADOWS.medium]}
        >
          <View style={[
            styles.resourceInner, 
            { 
              borderColor: isOfficial 
                ? (isDarkMode ? 'rgba(255, 193, 7, 0.5)' : 'rgba(255, 193, 7, 0.4)')
                : (isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)'), 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }
          ]}>
            <View style={[
              styles.resourceIcon, 
              { backgroundColor: isOfficial ? colors.accent + '20' : colors.primary + '20' }
            ]}>
              <MaterialIcons 
                name={isOfficial ? 'public' : 'article'} 
                size={24} 
                color={isOfficial ? colors.accent : colors.primary} 
              />
            </View>
            
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]} numberOfLines={2}>
                {resource.title}
              </Text>
              <View style={styles.resourceMeta}>
                <MaterialIcons name="link" size={14} color={colors.textLight} />
                <Text style={[styles.resourceMetaText, { color: colors.textLight }]}>
                  {isOfficial ? 'Official Link' : 'PDF Guide'}
                </Text>
              </View>
            </View>
            
            <MaterialIcons name="open-in-new" size={20} color={colors.textLight} />
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchBlur: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  officialSectionHeader: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resourceCard: {
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  resourceInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  resourceContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  resourceTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  resourceMetaText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  noResultsText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  // Floating circles - PASTEL COLORS
  floatingCircle: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 0,
  },
  circle1: {
    width: 200,
    height: 200,
    top: 80,
    right: -70,
  },
  circle2: {
    width: 180,
    height: 180,
    top: 280,
    left: -60,
  },
  circle3: {
    width: 160,
    height: 160,
    top: 480,
    right: -50,
  },
  circle4: {
    width: 190,
    height: 190,
    top: 630,
    left: -65,
  },
  circle5: {
    width: 170,
    height: 170,
    top: 120,
    left: 20,
  },
  circle6: {
    width: 185,
    height: 185,
    top: 360,
    right: 10,
  },
  // Small circles
  circleSmall1: {
    width: 90,
    height: 90,
    top: 200,
    right: 20,
  },
  circleSmall2: {
    width: 80,
    height: 80,
    top: 400,
    left: 40,
  },
  circleSmall3: {
    width: 100,
    height: 100,
    top: 540,
    left: 10,
  },
});
