import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingTTSButton } from '../components/FloatingTTSButton';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { getAllMembers, searchMembersByName, Member, Event } from '../utils/membersDatabase';



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
  const [isSearching, setIsSearching] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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
  setIsSearching(true);

  if (!query.trim()) {
    setFilteredMembers(members);
    setIsSearching(false);
    return;
  }

  const lower = query.toLowerCase();

  // 1. Search by name (your existing DB search)
  const nameResults = await searchMembersByName(query);

  // 2. Search locally for event name matches
  const eventResults = members.filter((member) =>
    member.events.some((event) =>
      event.name.toLowerCase().includes(lower)
    )
  );

  // 3. Merge results + remove duplicates
  const combined = [...nameResults, ...eventResults];
  const unique = combined.filter(
    (item, index, self) => index === self.findIndex((m) => m.id === item.id)
  );

  setFilteredMembers(unique);
  setIsSearching(false);
};


  const toggleMemberExpansion = useCallback((memberId: string) => {
    setExpandedMemberId(prev => prev === memberId ? null : memberId);
  }, []);





  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0E13' : '#F5F7FA' }]}>
        <SafeAreaView style={styles.loadingContainer}>
          <View style={styles.bouncyDotsContainer}>
            <BouncyDot delay={0} color={isDarkMode ? '#5A9FEE' : '#00A3E0'} />
            <BouncyDot delay={150} color={isDarkMode ? '#5A9FEE' : '#00A3E0'} />
            <BouncyDot delay={300} color={isDarkMode ? '#5A9FEE' : '#00A3E0'} />
          </View>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading members...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Enhanced Header with Gradient */}
        <View style={[styles.header, {
          backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7',
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 163, 224, 0.15)'
        }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, {
                backgroundColor: 'transparent',
                borderWidth: 0
              }]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Members Hub</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Connect with fellow members
              </Text>
            </View>
          </View>
        </View>

        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 163, 224, 0.15)',
              shadowColor: isDarkMode ? '#000000' : '#003DA5',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.08,
              shadowRadius: 8,
              elevation: 4,
            }
          ]}>
            <MaterialIcons name="search" size={20} color={isDarkMode ? 'rgba(90, 159, 238, 0.6)' : 'rgba(0, 163, 224, 0.6)'} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search members or events..."
              placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch('')}
                activeOpacity={0.7}
                style={styles.clearButton}
              >
                <MaterialIcons name="close" size={18} color={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Animated ScrollView */}
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                colors={colors}
                isDarkMode={isDarkMode}
                isExpanded={expandedMemberId === member.id}
                onToggle={() => toggleMemberExpansion(member.id)}
                scrollY={scrollY}
                index={index}
              />
            ))
          ) : searchQuery.length > 0 ? (
            <View style={styles.noResults}>
              <View style={[styles.noResultsIcon, {
                backgroundColor: isDarkMode ? 'rgba(90, 159, 238, 0.1)' : 'rgba(0, 163, 224, 0.08)',
                borderWidth: 1,
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 163, 224, 0.15)'
              }]}>
                <MaterialIcons name="search-off" size={40} color={isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(0, 163, 224, 0.5)'} />
              </View>
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                No results for "{searchQuery}"
              </Text>
            </View>
          ) : null}
        </Animated.ScrollView>
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

const MemberCard = React.memo(({ member, colors, isDarkMode, isExpanded, onToggle, scrollY, index }: MemberCardProps & { scrollY: Animated.Value; index: number }) => {
  const FIXED_EXPANDED_HEIGHT = 220;
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const heightAnim = useRef(new Animated.Value(isExpanded ? FIXED_EXPANDED_HEIGHT : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  // Scroll-based scaling animation
  const CARD_HEIGHT = 120; // Approximate card height
  const cardPosition = index * CARD_HEIGHT;
  const screenCenter = 200; // Approximate center position

  const scale = scrollY.interpolate({
    inputRange: [
      cardPosition - screenCenter - CARD_HEIGHT,
      cardPosition - screenCenter,
      cardPosition - screenCenter + CARD_HEIGHT,
      cardPosition - screenCenter + CARD_HEIGHT * 2,
    ],
    outputRange: [0.9, 1.1, 1.1, 0.9],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (isExpanded !== localExpanded) {
      setLocalExpanded(isExpanded);
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: isExpanded ? FIXED_EXPANDED_HEIGHT : 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: isExpanded ? 1 : 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isExpanded, localExpanded, heightAnim, opacityAnim]);

  return (
    <Animated.View style={styles.memberCardContainer}>
      <Animated.View
        style={[
          styles.memberCard,
          {
            backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 163, 224, 0.15)',
            shadowColor: isDarkMode ? '#000000' : '#003DA5',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.08,
            shadowRadius: 8,
            elevation: 4,
            transform: [{ scale }],
          }
        ]}
      >
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
          style={styles.memberCardTouchable}
        >
        <View style={[styles.avatar, {
          backgroundColor: isDarkMode ? 'rgba(90, 159, 238, 0.15)' : 'rgba(0, 163, 224, 0.12)',
          borderWidth: 1.5,
          borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(0, 163, 224, 0.3)',
        }]}>
          <Text style={[styles.avatarText, { color: isDarkMode ? '#5A9FEE' : '#00A3E0' }]}>{member.initials}</Text>
        </View>

        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={[styles.memberBio, { color: colors.textSecondary }]} numberOfLines={1}>
            {member.bio}
          </Text>
          <View style={styles.eventBadge}>
            <MaterialIcons name="workspace-premium" size={12} color={isDarkMode ? 'rgba(90, 159, 238, 0.7)' : 'rgba(0, 163, 224, 0.7)'} />
            <Text style={[styles.eventCount, { color: colors.textLight }]}>
              {member.events.length} {member.events.length === 1 ? 'event' : 'events'}
            </Text>
          </View>
        </View>

        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(0, 163, 224, 0.5)'}
        />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.expandedContent,
          {
            maxHeight: heightAnim,
            opacity: opacityAnim,
          }
        ]}
      >
        <View style={[styles.expandedInner, {
          backgroundColor: isDarkMode ? '#0F1419' : '#F0F7FF',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 163, 224, 0.15)',
        }]}>
          <Text style={[styles.expandedBio, { color: colors.text }]}>{member.bio}</Text>

          {member.events.length > 0 && (
            <View style={styles.eventsSection}>
              <View style={styles.eventsSectionHeader}>
                <MaterialIcons name="workspace-premium" size={14} color={isDarkMode ? '#5A9FEE' : '#00A3E0'} />
                <Text style={[styles.eventsTitle, { color: colors.textSecondary }]}>Competing Events</Text>
              </View>
              {member.events.slice(0, 2).map((event) => (
                <View key={event.id} style={[styles.eventItem, {
                  backgroundColor: isDarkMode ? 'rgba(90, 159, 238, 0.08)' : 'rgba(0, 163, 224, 0.06)',
                  borderLeftWidth: 2,
                  borderLeftColor: isDarkMode ? '#5A9FEE' : '#00A3E0',
                }]}>
                  <Text style={[styles.eventItemText, { color: colors.text }]} numberOfLines={1}>
                    {event.name}
                  </Text>
                </View>
              ))}
              {member.events.length > 2 && (
                <Text style={[styles.moreEvents, { color: isDarkMode ? '#5A9FEE' : '#00A3E0' }]}>
                  +{member.events.length - 2} more
                </Text>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isDarkMode === nextProps.isDarkMode
  );
});

MemberCard.displayName = 'MemberCard';

// Bouncy Dot Component using built-in Animated API
const BouncyDot = ({ delay, color }: { delay: number; color: string }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -16,
          duration: 400,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

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
    gap: SPACING.lg,
  },
  bouncyDotsContainer: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 18,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontSize: 15,
    paddingVertical: SPACING.xs,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  stackCard: {
    marginBottom: SPACING.md,
  },
  stackCardContent: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  stackCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  stackCardInfo: {
    flex: 1,
    gap: 4,
  },
  stackCardName: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
  },
  stackCardBio: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 14,
    lineHeight: 20,
  },
  memberCardContainer: {
    marginBottom: SPACING.xs + 2,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
  },
  memberBio: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 13,
    lineHeight: 18,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  eventCount: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '500',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  expandedInner: {
    padding: SPACING.md,
    borderBottomLeftRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
  },
  expandedBio: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  eventsSection: {
    gap: SPACING.xs,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  eventsTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventItem: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  eventItemText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 13,
    fontWeight: '500',
  },
  moreEvents: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '600',
    marginTop: SPACING.xs - 2,
    marginLeft: SPACING.xs,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 1.5,
  },
  noResultsIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  noResultsText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  memberCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
});
