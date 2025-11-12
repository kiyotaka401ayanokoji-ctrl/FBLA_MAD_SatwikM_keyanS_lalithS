import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import InstagramFeed from '../components/InstagramFeed';
import { useTheme } from '../contexts/ThemeContext';

// 🔥 UPDATE THESE POST URLS WHENEVER YOU WANT TO SHOW NEW POSTS!
const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/',
  'https://www.instagram.com/fbla.nchs/p/DP1X0WJkXig/',
  'https://www.instagram.com/fbla.nchs/p/DQiEQvRkvjA/',
];

export default function InstagramFeedScreen() {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDarkMode 
          ? [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, colors.backgroundGradient4]
          : [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, colors.backgroundGradient4]
        }
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <InstagramFeed postUrls={INSTAGRAM_POST_URLS} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
