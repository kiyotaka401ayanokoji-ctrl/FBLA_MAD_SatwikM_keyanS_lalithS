import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

interface InstagramFeedProps {
  postUrls: string[];
}

// Web version - uses HTML iframes to embed Instagram posts
export default function InstagramFeed({ postUrls }: InstagramFeedProps) {
  const { colors } = useTheme();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Load Instagram embed script
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setScriptsLoaded(true);
        // Process embeds after script loads
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Re-process embeds when posts change
  useEffect(() => {
    if (Platform.OS === 'web' && scriptsLoaded && (window as any).instgrm) {
      setTimeout(() => {
        (window as any).instgrm.Embeds.process();
      }, 100);
    }
  }, [postUrls, scriptsLoaded]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>
          Follow us on Instagram @fbla.nchs 📸
        </Text>
      </View>

      {/* Instagram Feed */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {postUrls.map((url, index) => (
          <View key={`${url}-${index}`} style={styles.postContainer}>
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <blockquote 
                    class="instagram-media" 
                    data-instgrm-permalink="${url}"
                    data-instgrm-version="14"
                    style="
                      background:#FFF; 
                      border:0; 
                      border-radius:12px; 
                      box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); 
                      margin: 1px; 
                      max-width:540px; 
                      min-width:326px; 
                      padding:0; 
                      width:99.375%; 
                      width:-webkit-calc(100% - 2px); 
                      width:calc(100% - 2px);
                    ">
                  </blockquote>
                `
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  postContainer: {
    width: '100%',
    maxWidth: 540,
    marginBottom: SPACING.lg,
  },
});