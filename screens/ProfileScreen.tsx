import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { FloatingTTSButton } from '../components/FloatingTTSButton';

const TTS_ENABLED_KEY = '@tts_enabled';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useSupabaseAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [profile, setProfile] = useState(user || {
    name: '',
    email: '',
    chapter: '',
    position: '',
    phone: '',
    bio: '',
    memberSince: '',
  });

  // Background animations
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const circle4Anim = useRef(new Animated.Value(0)).current;
  const circle5Anim = useRef(new Animated.Value(0)).current;
  const circle6Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTTSPreference();

    const animateCircle = (anim: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    };

    animateCircle(circle1Anim, 13000);
    animateCircle(circle2Anim, 16000);
    animateCircle(circle3Anim, 19000);
    animateCircle(circle4Anim, 21000);
    animateCircle(circle5Anim, 16000);
    animateCircle(circle6Anim, 18000);
  }, []);

  const loadTTSPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem(TTS_ENABLED_KEY);
      setTtsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading TTS preference:', error);
    }
  };

  const toggleTTS = async () => {
    try {
      const newValue = !ttsEnabled;
      await AsyncStorage.setItem(TTS_ENABLED_KEY, String(newValue));
      setTtsEnabled(newValue);
      Alert.alert(
        'Text-to-Speech',
        `Text-to-Speech has been ${newValue ? 'enabled' : 'disabled'}. A speaker button will ${newValue ? 'appear' : 'disappear'} on all pages.`
      );
    } catch (error) {
      console.error('Error saving TTS preference:', error);
      Alert.alert('Error', 'Failed to update TTS setting');
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: profile.name,
        chapter: profile.chapter,
        position: profile.position,
        phone: profile.phone,
        bio: profile.bio,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const pickImage = async () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) setProfileImage(result.assets[0].uri);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Photo library permission is required.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) setProfileImage(result.assets[0].uri);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  function InfoField({ icon, label, value, editable = false, multiline = false, colors, isEditing, profile, setProfile }: any) {
    return (
      <View style={styles.infoField}>
        <View style={styles.fieldHeader}>
          <MaterialIcons name={icon} size={20} color={colors.primary} />
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
        {isEditing && editable ? (
          <TextInput
            style={[
              styles.fieldInput,
              { color: colors.text, backgroundColor: 'transparent', borderColor: colors.border },
              multiline && styles.fieldInputMultiline,
            ]}
            value={value}
            onChangeText={(text) => setProfile({ ...profile, [label.toLowerCase()]: text })}
            multiline={multiline}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
        )}
      </View>
    );
  }

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 100] });
  const circle1TranslateX = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [15, 55] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [70, -30] });
  const circle2TranslateX = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [25, -45] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [-35, 85] });
  const circle3TranslateX = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [-5, 35] });
  const circle4TranslateY = circle4Anim.interpolate({ inputRange: [0, 1], outputRange: [65, -45] });
  const circle4TranslateX = circle4Anim.interpolate({ inputRange: [0, 1], outputRange: [-25, 40] });
  const circle5TranslateY = circle5Anim.interpolate({ inputRange: [0, 1], outputRange: [-55, 75] });
  const circle5TranslateX = circle5Anim.interpolate({ inputRange: [0, 1], outputRange: [40, -30] });
  const circle6TranslateY = circle6Anim.interpolate({ inputRange: [0, 1], outputRange: [50, -20] });
  const circle6TranslateX = circle6Anim.interpolate({ inputRange: [0, 1], outputRange: [-35, 45] });

  const ttsContent = `
    Profile Screen.
    Name: ${profile.name || 'Not set'}.
    Position: ${profile.position || 'Not set'}.
    Chapter: ${profile.chapter || 'Not set'}.
    Email: ${profile.email || 'Not set'}.
    Phone: ${profile.phone || 'Not set'}.
    Bio: ${profile.bio || 'Not set'}.
    Events Attended: ${user?.eventsAttended || 0}.
    Days as Member: ${profile.memberSince ? Math.floor((Date.now() - new Date(profile.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 0}.
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      {/* Floating Background Circles - PASTEL with Dark Mode support */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.16)' : 'rgba(221, 214, 254, 0.4)',
            transform: [{ translateY: circle1TranslateY }, { translateX: circle1TranslateX }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.16)' : 'rgba(219, 234, 254, 0.4)',
            transform: [{ translateY: circle2TranslateY }, { translateX: circle2TranslateX }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.16)' : 'rgba(220, 252, 231, 0.4)',
            transform: [{ translateY: circle3TranslateY }, { translateX: circle3TranslateX }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle4,
          {
            backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.16)' : 'rgba(252, 231, 243, 0.45)',
            transform: [{ translateY: circle4TranslateY }, { translateX: circle4TranslateX }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle5,
          {
            backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.16)' : 'rgba(254, 243, 199, 0.4)',
            transform: [{ translateY: circle5TranslateY }, { translateX: circle5TranslateX }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle6,
          {
            backgroundColor: isDarkMode ? 'rgba(244, 63, 94, 0.16)' : 'rgba(254, 226, 226, 0.4)',
            transform: [{ translateY: circle6TranslateY }, { translateX: circle6TranslateX }],
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
              { translateY: circle1TranslateY.interpolate({ inputRange: [0, 100], outputRange: [0, -65] }) },
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
              { translateX: circle3TranslateX.interpolate({ inputRange: [-35, 35], outputRange: [40, -20] }) },
            ],
          },
        ]}
      />

      <View style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <MaterialIcons name={isEditing ? 'check' : 'edit'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Profile Header */}
          <Animated.View entering={FadeIn.duration(600)}>
            <BlurView intensity={isDarkMode ? 45 : 95} tint={isDarkMode ? 'dark' : 'light'} style={[styles.profileHeader, SHADOWS.large]}>
              <View
                style={[
                  styles.profileInner,
                  styles.glassOverlay,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.35)' : 'rgba(255, 255, 255, 0.35)',
                  },
                ]}
              >
                <View style={styles.avatarContainer}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <MaterialIcons name="account-circle" size={80} color={colors.primary} />
                  )}
                  {isEditing && (
                    <TouchableOpacity style={[styles.avatarEditButton, { backgroundColor: colors.primary }]} onPress={pickImage}>
                      <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={[styles.profilePosition, { color: colors.textSecondary }]}>{profile.position}</Text>
                <View style={[styles.chapterBadge, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialIcons name="school" size={16} color={colors.primary} />
                  <Text style={[styles.chapterText, { color: colors.primary }]}>{profile.chapter}</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Stats Card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <BlurView intensity={isDarkMode ? 45 : 95} tint={isDarkMode ? 'dark' : 'light'} style={[styles.statsCard, SHADOWS.medium]}>
              <View
                style={[
                  styles.statsInner,
                  styles.glassOverlay,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.35)' : 'rgba(255, 255, 255, 0.35)',
                  },
                ]}
              >
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>{user?.eventsAttended || 0}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events Attended</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {profile.memberSince
                      ? Math.floor((Date.now() - new Date(profile.memberSince).getTime()) / (1000 * 60 * 60 * 24))
                      : 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days as Member</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <BlurView intensity={isDarkMode ? 45 : 95} tint={isDarkMode ? 'dark' : 'light'} style={[styles.infoCard, SHADOWS.medium]}>
              <View
                style={[
                  styles.infoInner,
                  styles.glassOverlay,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.35)' : 'rgba(255, 255, 255, 0.35)',
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
                <InfoField icon="email" label="Email" value={profile.email} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
                <InfoField icon="phone" label="Phone" value={profile.phone} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
                <InfoField icon="calendar-today" label="Member Since" value={profile.memberSince} colors={colors} isEditing={false} profile={profile} setProfile={setProfile} />
                <InfoField icon="info" label="Bio" value={profile.bio} editable multiline colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
              </View>
            </BlurView>
          </Animated.View>

          {/* Settings Card */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <BlurView intensity={isDarkMode ? 45 : 95} tint={isDarkMode ? 'dark' : 'light'} style={[styles.settingsCard, SHADOWS.medium]}>
              <View
                style={[
                  styles.settingsInner,
                  styles.glassOverlay,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.35)' : 'rgba(255, 255, 255, 0.35)',
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]} onPress={toggleTheme}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={24} color={colors.textSecondary} />
                    <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
                  </View>
                  <View style={[styles.toggle, { backgroundColor: isDarkMode ? colors.primary : colors.border }]}>
                    <View style={[styles.toggleThumb, { transform: [{ translateX: isDarkMode ? 20 : 0 }] }]} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]} onPress={toggleTTS}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name="record-voice-over" size={24} color={colors.textSecondary} />
                    <Text style={[styles.settingText, { color: colors.text }]}>Text-to-Speech</Text>
                  </View>
                  <View style={[styles.toggle, { backgroundColor: ttsEnabled ? colors.primary : colors.border }]}>
                    <View style={[styles.toggleThumb, { transform: [{ translateX: ttsEnabled ? 20 : 0 }] }]} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name="notifications" size={24} color={colors.textSecondary} />
                    <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name="lock" size={24} color={colors.textSecondary} />
                    <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name="help" size={24} color={colors.textSecondary} />
                    <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleSignOut}>
                  <View style={styles.settingLeft}>
                    <MaterialIcons name="logout" size={24} color={colors.error} />
                    <Text style={[styles.settingText, styles.logoutText, { color: colors.error }]}>Log Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>

        <FloatingTTSButton content={ttsContent} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  profileInner: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  profilePosition: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  chapterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  chapterText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  statsCard: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  statsInner: {
    padding: SPACING.lg,
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    marginHorizontal: SPACING.md,
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  infoInner: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  infoField: {
    marginBottom: SPACING.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  fieldLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  fieldValue: {
    ...TYPOGRAPHY.body,
    marginLeft: 28,
  },
  fieldInput: {
    ...TYPOGRAPHY.body,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginLeft: 28,
    borderWidth: 1,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingsCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  settingsInner: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.md,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontWeight: '600',
  },
  // Shared glass overlay for all cards
  glassOverlay: {
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.lg,
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
    top: 60,
    right: -80,
  },
  circle2: {
    width: 190,
    height: 190,
    top: 260,
    left: -70,
  },
  circle3: {
    width: 170,
    height: 170,
    top: 460,
    right: -60,
  },
  circle4: {
    width: 200,
    height: 200,
    top: 610,
    left: -75,
  },
  circle5: {
    width: 180,
    height: 180,
    top: 100,
    left: 10,
  },
  circle6: {
    width: 195,
    height: 195,
    top: 340,
    right: 0,
  },
  // Small circles
  circleSmall1: {
    width: 100,
    height: 100,
    top: 180,
    right: 10,
  },
  circleSmall2: {
    width: 90,
    height: 90,
    top: 380,
    left: 30,
  },
  circleSmall3: {
    width: 110,
    height: 110,
    top: 520,
    left: 0,
  },
});
