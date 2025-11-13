import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getAllMembers, searchMembersByName, searchMembersByEvent, Member, Event } from '../utils/membersDatabase';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MemberWithEvents extends Member {
  events: Event[];
}

export default function MembersHubScreen({ navigation }: any) {
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0E13' : '#E8EDF2' }]}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading members...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0E13' : '#E8EDF2' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={isDarkMode 
            ? ['#1A1F2E', '#252A35', '#1A1F2E'] 
            : ['#FFFFFF', '#FFF9E6', '#FFFFFF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { borderBottomColor: isDarkMode ? '#2A3142' : '#FFE8A3' }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={[styles.backButton, { backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.1)' : 'rgba(255, 184, 28, 0.15)' }]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.secondary} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.15)' : 'rgba(255, 184, 28, 0.2)' }]}>
                <MaterialIcons name="people" size={32} color={colors.secondary} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Members Hub</Text>
                <View style={styles.memberCountBadge}>
                  <View style={[styles.countDot, { backgroundColor: colors.secondary }]} />
                  <Text style={[styles.memberCount, { color: colors.textSecondary }]}>
                    {members.length} active members
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar, 
            { 
              backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF',
              borderColor: isDarkMode ? 'rgba(255, 184, 28, 0.2)' : 'rgba(255, 184, 28, 0.3)',
            }
          ]}>
            <View style={[styles.searchIconContainer, { backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.1)' : 'rgba(255, 184, 28, 0.15)' }]}>
              <MaterialIcons name="search" size={20} color={colors.secondary} />
            </View>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name or event..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => handleSearch('')} 
                activeOpacity={0.7}
                style={styles.clearButton}
              >
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
          removeClippedSubviews={false}
        >
          {searchByEvent ? (
            // Event-based results
            eventResults.map((eventResult, eventIndex) => (
              <View key={eventResult.eventName}>
                <View style={styles.eventSection}>
                  <LinearGradient
                    colors={isDarkMode 
                      ? ['rgba(255, 184, 28, 0.08)', 'rgba(255, 184, 28, 0.03)'] 
                      : ['rgba(255, 184, 28, 0.12)', 'rgba(255, 184, 28, 0.05)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.eventHeader}
                  >
                    <MaterialIcons name="event" size={20} color={colors.secondary} />
                    <Text style={[styles.eventName, { color: colors.text }]}>{eventResult.eventName}</Text>
                    <View style={[styles.eventCountBadge, { backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.15)' : 'rgba(255, 184, 28, 0.2)' }]}>
                      <Text style={[styles.eventMemberCount, { color: colors.secondary }]}>
                        {eventResult.members.length}
                      </Text>
                    </View>
                  </LinearGradient>
                  {eventResult.members.map((member, memberIndex) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      colors={colors}
                      isDarkMode={isDarkMode}
                      isExpanded={expandedMemberId === member.id}
                      onToggle={() => toggleMemberExpansion(member.id)}
                    />
                  ))}
                </View>
              </View>
            ))
          ) : (
            // Name-based results
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                colors={colors}
                isDarkMode={isDarkMode}
                isExpanded={expandedMemberId === member.id}
                onToggle={() => toggleMemberExpansion(member.id)}
              />
            ))
          )}

          {!searchByEvent && filteredMembers.length === 0 && searchQuery.length > 0 && (
            <View style={styles.noResults}>
              <View style={[styles.noResultsIcon, { backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.1)' : 'rgba(255, 184, 28, 0.15)' }]}>
                <MaterialIcons name="search-off" size={48} color={colors.secondary} />
              </View>
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                No members found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface MemberCardProps {
  member: MemberWithEvents;
  colors: any;
  isDarkMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const MemberCard = React.memo(({ member, colors, isDarkMode, isExpanded, onToggle }: MemberCardProps) => {
  const FIXED_EXPANDED_HEIGHT = 220;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? FIXED_EXPANDED_HEIGHT : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, heightAnim, opacityAnim]);

  return (
    <View style={styles.memberCardContainer}>
      <TouchableOpacity 
        onPress={onToggle}
        activeOpacity={0.7}
        style={[
          styles.memberCard,
          { 
            backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF',
            borderColor: isDarkMode ? 'rgba(255, 184, 28, 0.15)' : 'rgba(255, 184, 28, 0.2)',
          }
        ]}
      >
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(255, 184, 28, 0.2)', 'rgba(255, 184, 28, 0.1)'] 
            : ['rgba(255, 184, 28, 0.25)', 'rgba(255, 184, 28, 0.15)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={[styles.avatarText, { color: colors.secondary }]}>{member.initials}</Text>
        </LinearGradient>

        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={[styles.memberBio, { color: colors.textSecondary }]} numberOfLines={1}>
            {member.bio}
          </Text>
          <View style={styles.eventBadge}>
            <MaterialIcons name="event" size={14} color={colors.secondary} />
            <Text style={[styles.eventCount, { color: colors.textLight }]}>
              {member.events.length} {member.events.length === 1 ? 'event' : 'events'}
            </Text>
          </View>
        </View>

        <MaterialIcons 
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color={colors.secondary} 
        />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.expandedContent, 
          { 
            maxHeight: heightAnim,
            opacity: opacityAnim,
          }
        ]}
      >
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(26, 31, 46, 0.5)', 'rgba(20, 24, 36, 0.8)'] 
            : ['rgba(255, 249, 230, 0.3)', 'rgba(245, 247, 250, 0.5)']
          }
          style={styles.expandedInner}
        >
          <Text style={[styles.expandedBio, { color: colors.text }]}>{member.bio}</Text>
          
          {member.events.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={[styles.eventsTitle, { color: colors.textSecondary }]}>Competing in:</Text>
              {member.events.slice(0, 2).map((event) => (
                <View key={event.id} style={[styles.eventItem, { 
                  backgroundColor: isDarkMode ? 'rgba(255, 184, 28, 0.08)' : 'rgba(255, 184, 28, 0.12)',
                  borderColor: isDarkMode ? 'rgba(255, 184, 28, 0.15)' : 'rgba(255, 184, 28, 0.2)',
                }]}>
                  <MaterialIcons name="star" size={16} color={colors.secondary} />
                  <Text style={[styles.eventItemText, { color: colors.text }]} numberOfLines={1}>
                    {event.name}
                  </Text>
                </View>
              ))}
              {member.events.length > 2 && (
                <Text style={[styles.moreEvents, { color: colors.secondary }]}>
                  +{member.events.length - 2} more {member.events.length - 2 === 1 ? 'event' : 'events'}
                </Text>
              )}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
});

MemberCard.displayName = 'MemberCard';

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
    paddingVertical: SPACING.lg,
    borderBottomWidth: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 26,
    marginBottom: SPACING.xs,
  },
  memberCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberCount: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingVertical: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.xs,
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
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  eventName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    flex: 1,
  },
  eventCountBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  eventMemberCount: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  memberCardContainer: {
    marginBottom: SPACING.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    fontWeight: '800',
  },
  memberInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  memberName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
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
    fontWeight: '600',
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
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.sm,
    borderWidth: 1,
  },
  eventItemText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
    fontWeight: '500',
  },
  moreEvents: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  noResultsIcon: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  noResultsText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});