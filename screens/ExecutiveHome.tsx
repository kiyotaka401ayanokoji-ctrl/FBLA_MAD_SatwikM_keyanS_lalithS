import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface ExecutiveHomeProps {
  navigation: any;
}

export default function ExecutiveHome({ navigation }: ExecutiveHomeProps) {
  const { colors } = useTheme();

  const features = [
    {
      title: 'Announcements',
      icon: 'announcement',
      description: 'Create and manage chapter announcements',
      screen: 'AnnouncementsManager'
    },
    {
      title: 'Events',
      icon: 'event',
      description: 'Organize and schedule chapter events',
      screen: 'EventsManager'
    },
    {
      title: 'Resources',
      icon: 'library-books',
      description: 'Manage educational resources and materials',
      screen: 'ResourcesManager'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={feature.title}
              style={[styles.featureCard, { backgroundColor: colors.surface }]}
              onPress={() => {
                // Placeholder for future navigation
                console.log(`Navigate to ${feature.screen}`);
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name={feature.icon as any} size={48} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featureTitle: {
    ...TYPOGRAPHY.h2,
    fontWeight: '700',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  featureDescription: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
});
