import React, { useState } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
      </SafeAreaView>
    </View>
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
});