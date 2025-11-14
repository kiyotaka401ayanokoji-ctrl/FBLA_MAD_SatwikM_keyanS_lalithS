import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const TTS_ENABLED_KEY = '@tts_enabled';

interface FloatingTTSButtonProps {
  content: string;
}

export const FloatingTTSButton: React.FC<FloatingTTSButtonProps> = ({ content }) => {
  const { speak, isSpeaking } = useTextToSpeech();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadTTSPreference();

    // Check for changes when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadTTSPreference();
      }
    });

    // Poll for changes every second (lightweight check)
    const interval = setInterval(() => {
      loadTTSPreference();
    }, 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  const loadTTSPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem(TTS_ENABLED_KEY);
      setIsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading TTS preference:', error);
    }
  };

  if (!isEnabled) return null;

  return (
    <TouchableOpacity
      style={[styles.floatingButton, isSpeaking && styles.floatingButtonActive]}
      onPress={() => speak(content)}
    >
      <Text style={styles.floatingButtonText}>
        {isSpeaking ? '⏸' : '🔊'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonActive: {
    backgroundColor: '#FF3B30',
  },
  floatingButtonText: {
    fontSize: 24,
  },
});