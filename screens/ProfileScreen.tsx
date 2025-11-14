import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
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

  useEffect(() => {
    loadTTSPreference();
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

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
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

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  function InfoField({ 
    icon, 
    label, 
    value, 
    editable = false,
    multiline = false,
    colors,
    isEditing,
    profile,
    setProfile,
  }: any) {
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
              { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              multiline && styles.fieldInputMultiline
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
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <MaterialIcons 
            name={isEditing ? 'check' : 'edit'} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          <BlurView 
            intensity={isDarkMode ? 45 : 95} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.profileHeader, SHADOWS.medium]}
          >
            <View style={[styles.profileInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <MaterialIcons name="account-circle" size={80} color={colors.primary} />
                )}
                {isEditing && (
                  <TouchableOpacity 
                    style={[styles.avatarEditButton, { backgroundColor: colors.primary }]}
                    onPress={pickImage}
                  >
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

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <BlurView 
            intensity={isDarkMode ? 45 : 95} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.statsCard, SHADOWS.medium]}
          >
            <View style={[styles.statsInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {user?.eventsAttended || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events Attended</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {profile.memberSince ? Math.floor((Date.now() - new Date(profile.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days as Member</Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <BlurView 
            intensity={isDarkMode ? 45 : 95} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.infoCard, SHADOWS.medium]}
          >
            <View style={[styles.infoInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
              
              <InfoField icon="email" label="Email" value={profile.email} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
              <InfoField icon="phone" label="Phone" value={profile.phone} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
              <InfoField icon="calendar-today" label="Member Since" value={profile.memberSince} colors={colors} isEditing={false} profile={profile} setProfile={setProfile} />
              <InfoField icon="info" label="Bio" value={profile.bio} editable multiline colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <BlurView 
            intensity={isDarkMode ? 45 : 95} 
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.settingsCard, SHADOWS.medium]}
          >
            <View style={[styles.settingsInner, { 
              borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
              borderWidth: 1.5,
              backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
            }]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});