import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { initDatabase, getAllMembers, searchMembersByName, searchMembersByEvent, Member } from '../utils/membersDatabase';

interface MembersHubScreenProps {
  navigation: any;
}

export default function MembersHubScreen({ navigation }: MembersHubScreenProps) {
  const { colors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [eventResults, setEventResults] = useState<{ eventName: string; members: Member[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<'name' | 'event'>('name');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await initDatabase();
      const allMembers = await getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      const allMembers = await getAllMembers();
      setMembers(allMembers);
      setEventResults([]);
      setSearchMode('name');
      return;
    }

    // Try searching by name first
    const memberResults = await searchMembersByName(query);
    
    // Also search by event
    const eventSearchResults = await searchMembersByEvent(query);

    if (eventSearchResults.length > 0) {
      setSearchMode('event');
      setEventResults(eventSearchResults);
      setMembers([]);
    } else {
      setSearchMode('name');
      setMembers(memberResults);
      setEventResults([]);
    }
  };

  const toggleMemberExpand = (memberId: number) => {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading Members...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Member Hub</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {members.length + eventResults.reduce((acc, e) => acc + e.members.length, 0)} members
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.searchContainer}>
          <BlurView 
            intensity={isDarkMode ? 30 : 90} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.searchBlur, SHADOWS.small]}
          >
            <View style={[styles.searchInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)', 
              borderWidth: 1,
              backgroundColor: isDarkMode ? 'rgba(20, 25, 30, 0.6)' : 'rgba(255, 255, 255, 0.95)'
            }]}>
              <MaterialIcons name="search" size={20} color={colors.textLight} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search by name or event..."
                placeholderTextColor={colors.textLight}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={18} color={colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </Animated.View>

        {/* Members List */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {searchMode === 'name' && members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              colors={colors}
              isDarkMode={isDarkMode}
              isExpanded={expandedMemberId === member.id}
              onToggle={() => toggleMemberExpand(member.id)}
            />
          ))}

          {searchMode === 'event' && eventResults.map((eventGroup, groupIndex) => (
            <Animated.View key={groupIndex} entering={FadeInDown.delay(groupIndex * 50).springify()}>
              <View style={styles.eventGroupHeader}>
                <MaterialIcons name="event" size={20} color={colors.primary} />
                <Text style={[styles.eventGroupTitle, { color: colors.text }]}>
                  {eventGroup.eventName}
                </Text>
                <View style={[styles.eventBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.eventBadgeText, { color: colors.primary }]}>
                    {eventGroup.members.length}
                  </Text>
                </View>
              </View>

              {eventGroup.members.map((member, memberIndex) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={memberIndex}
                  colors={colors}
                  isDarkMode={isDarkMode}
                  isExpanded={expandedMemberId === member.id}
                  onToggle={() => toggleMemberExpand(member.id)}
                />
              ))}
            </Animated.View>
          ))}

          {members.length === 0 && eventResults.length === 0 && searchQuery.trim() !== '' && (
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.noResults}>
              <MaterialIcons name="search-off" size={64} color={colors.textLight} />
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                No members found for &quot;{searchQuery}&quot;
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface MemberCardProps {
  member: Member;
  index: number;
  colors: any;
  isDarkMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function MemberCard({ member, index, colors, isDarkMode, isExpanded, onToggle }: MemberCardProps) {
  const heightValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(isExpanded ? heightValue.value : 0, {
        damping: 15,
        stiffness: 150,
      }),
      opacity: withSpring(isExpanded ? 1 : 0, {
        damping: 15,
        stiffness: 150,
      }),
    };
  });

  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
        <BlurView 
          intensity={isDarkMode ? 25 : 85} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.memberCard, SHADOWS.small]}
        >
          <View style={[styles.memberCardInner, { 
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.25)' : 'rgba(255, 255, 255, 0.9)', 
            borderWidth: 0.5,
            backgroundColor: isDarkMode ? 'rgba(20, 25, 30, 0.5)' : 'rgba(255, 255, 255, 0.98)'
          }]}>
            {/* Member Header */}
            <View style={styles.memberHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{member.initials}</Text>
              </View>
              
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
                  {member.name}
                </Text>
                <Text style={[styles.memberBio, { color: colors.textSecondary }]} numberOfLines={isExpanded ? undefined : 1}>
                  {member.bio}
                </Text>
              </View>

              <MaterialIcons 
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color={colors.textLight} 
              />
            </View>

            {/* Expanded Content */}
            {isExpanded && (
              <Animated.View 
                style={[styles.expandedContent]}
                onLayout={(e) => {
                  heightValue.value = e.nativeEvent.layout.height;
                }}
              >
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                
                <View style={styles.eventsSection}>
                  <View style={styles.eventsSectionHeader}>
                    <MaterialIcons name="event-note" size={18} color={colors.primary} />
                    <Text style={[styles.eventsSectionTitle, { color: colors.text }]}>
                      Events ({member.events.length})
                    </Text>
                  </View>

                  {member.events.slice(0, 2).map((event, idx) => (
                    <View key={idx} style={[styles.eventChip, { backgroundColor: colors.primary + '15' }]}>
                      <MaterialIcons name="circle" size={6} color={colors.primary} />
                      <Text style={[styles.eventChipText, { color: colors.text }]} numberOfLines={1}>
                        {event}
                      </Text>
                    </View>
                  ))}

                  {member.events.length > 2 && (
                    <Text style={[styles.moreEventsText, { color: colors.textLight }]}>
                      +{member.events.length - 2} more event{member.events.length - 2 > 1 ? 's' : ''}
                    </Text>
                  )}

                  {member.events.length === 0 && (
                    <Text style={[styles.noEventsText, { color: colors.textLight }]}>
                      No events yet
                    </Text>
                  )}
                </View>
              </Animated.View>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
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
  eventGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  eventGroupTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    flex: 1,
  },
  eventBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  eventBadgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    fontSize: 11,
  },
  memberCard: {
    borderRadius: 14,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  memberCardInner: {
    padding: SPACING.md,
    borderRadius: 14,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  memberName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberBio: {
    ...TYPOGRAPHY.caption,
    lineHeight: 16,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  eventsSection: {
    paddingTop: SPACING.xs,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  eventsSectionTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  eventChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  eventChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    flex: 1,
  },
  moreEventsText: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  noEventsText: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
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