import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import NewsCard from '../components/NewsCard';
import { mockNews } from '../data/mockData';
import { NewsItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';


export default function NewsFeedScreen() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'reminder', label: 'Reminders' },
    { id: 'update', label: 'Updates' },
  ];

  const handleLike = (id: string) => {
    setNewsItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));
  };

  const filteredNews = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>News Feed</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <Animated.View entering={FadeIn.duration(600)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary },
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* News Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      >
        {filteredNews.map((news, index) => (
          <NewsCard
            key={news.id}
            news={news}
            onLike={() => handleLike(news.id)}
            index={index}
          />
        ))}
      </ScrollView>
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
  searchButton: {
    padding: SPACING.xs,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  feedContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
});
