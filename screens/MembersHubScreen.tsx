import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { getAllMembers, searchMembersByName, searchMembersByEvent, Member, Event } from '../utils/membersDatabase';

interface MemberWithEvents extends Member {
  events: Event[];
}

export default function MembersHubScreen() {
  const { colors, isDarkMode } = useTheme();
  const [members, setMembers] = useState<MemberWithEvents[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberWithEvents[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [searchByEvent, setSearchByEvent] = useState(false);
  const [eventResults, setEventResults] = useState<{ eventName: string; members: MemberWithEvents[] }[]>([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    const allMembers = await getAllMembers();
    setMembers(allMembers);
    setFilteredMembers(allMembers);
    setIsLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMembers(members);
      setEventResults([]);
      setSearchByEvent(false);
      return;
    }

    // Try searching by event first
    const eventSearchResults = await searchMembersByEvent(query);
    
    if (eventSearchResults.length > 0) {
      setEventResults(eventSearchResults);
      setSearchByEvent(true);
      setFilteredMembers([]);
    } else {
      // Fall back to name search
      const nameSearchResults = await searchMembersByName(query);
      setFilteredMembers(nameSearchResults);
      setEventResults([]);
      setSearchByEvent(false);
    }
  };

  const toggleMemberExpansion = (memberId: string) => {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0E13' : '#E8EDF2' }]}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading members...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0E13' : '#E8EDF2' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF', borderBottomColor: isDarkMode ? '#2A3142' : '#E0E0E0' }]}>
          <View style={styles.headerContent}>
            <MaterialIcons name="people" size={28} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Members Hub</Text>
          </View>
          <Text style={[styles.memberCount, { color: colors.textSecondary }]}>
            {members.length} members
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A3142' : '#E0E0E0' }]}>
            <MaterialIcons name="search" size={22} color={colors.textLight} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name or event..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} activeOpacity={0.7}>
                <MaterialIcons name="close" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Members List */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {searchByEvent ? (
            // Event-based results
            eventResults.map((eventResult, eventIndex) => (
              <Animated.View key={eventResult.eventName} entering={FadeInDown.delay(eventIndex * 50).springify()}>
                <View style={styles.eventSection}>
                  <View style={[styles.eventHeader, { backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF' }]}>
                    <MaterialIcons name="event" size={20} color={colors.primary} />
                    <Text style={[styles.eventName, { color: colors.text }]}>{eventResult.eventName}</Text>
                    <Text style={[styles.eventMemberCount, { color: colors.textSecondary }]}>
                      {eventResult.members.length} {eventResult.members.length === 1 ? 'member' : 'members'}
                    </Text>
                  </View>
                  {eventResult.members.map((member, memberIndex) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      index={memberIndex}
                      colors={colors}
                      isDarkMode={isDarkMode}
                      isExpanded={expandedMemberId === member.id}
                      onToggle={() => toggleMemberExpansion(member.id)}
                    />
                  ))}
                </View>
              </Animated.View>
            ))
          ) : (
            // Name-based results
            filteredMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                colors={colors}
                isDarkMode={isDarkMode}
                isExpanded={expandedMemberId === member.id}
                onToggle={() => toggleMemberExpansion(member.id)}
              />
            ))
          )}

          {!searchByEvent && filteredMembers.length === 0 && searchQuery.length > 0 && (
            <Animated.View entering={FadeIn} style={styles.noResults}>
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
  member: MemberWithEvents;
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
        stiffness: 100,
      }),
      opacity: withSpring(isExpanded ? 1 : 0),
    };
  });

  useEffect(() => {
    if (isExpanded) {
      heightValue.value = member.events.length > 0 ? 120 + (member.events.length * 40) : 120;
    }
  }, [isExpanded, member.events.length]);

  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()} style={styles.memberCardContainer}>
      <TouchableOpacity 
        onPress={onToggle}
        activeOpacity={0.7}
        style={[
          styles.memberCard,
          { 
            backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF',
            borderColor: isDarkMode ? '#2A3142' : '#E0E0E0',
          }
        ]}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{member.initials}</Text>
        </View>

        {/* Member Info */}
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={[styles.memberBio, { color: colors.textSecondary }]} numberOfLines={1}>
            {member.bio}
          </Text>
          <View style={styles.eventBadge}>
            <MaterialIcons name="event" size={14} color={colors.textLight} />
            <Text style={[styles.eventCount, { color: colors.textLight }]}>
              {member.events.length} {member.events.length === 1 ? 'event' : 'events'}
            </Text>
          </View>
        </View>

        {/* Expand Icon */}
        <MaterialIcons 
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color={colors.textLight} 
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      <Animated.View style={[styles.expandedContent, animatedStyle]}>
        <View style={[styles.expandedInner, { backgroundColor: isDarkMode ? '#141824' : '#F5F7FA' }]}>
          <Text style={[styles.expandedBio, { color: colors.text }]}>{member.bio}</Text>
          
          {member.events.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={[styles.eventsTitle, { color: colors.textSecondary }]}>Competing in:</Text>
              {member.events.slice(0, 2).map((event, idx) => (
                <View key={event.id} style={[styles.eventItem, { backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF' }]}>
                  <MaterialIcons name="star" size={16} color={colors.accent} />
                  <Text style={[styles.eventItemText, { color: colors.text }]} numberOfLines={1}>
                    {event.name}
                  </Text>
                </View>
              ))}
              {member.events.length > 2 && (
                <Text style={[styles.moreEvents, { color: colors.textLight }]}>
                  +{member.events.length - 2} more {member.events.length - 2 === 1 ? 'event' : 'events'}
                </Text>
              )}
            </View>
          )}
        </View>
      </Animated.View>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
  },
  memberCount: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingVertical: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  eventSection: {
    marginBottom: SPACING.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  eventName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    flex: 1,
  },
  eventMemberCount: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  memberCardContainer: {
    marginBottom: SPACING.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  memberName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  memberBio: {
    ...TYPOGRAPHY.bodySmall,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  eventCount: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  expandedInner: {
    padding: SPACING.md,
    borderBottomLeftRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
    marginTop: -BORDER_RADIUS.md,
    paddingTop: SPACING.md + BORDER_RADIUS.md,
  },
  expandedBio: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  eventsSection: {
    gap: SPACING.xs,
  },
  eventsTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.sm,
  },
  eventItemText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
  },
  moreEvents: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
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