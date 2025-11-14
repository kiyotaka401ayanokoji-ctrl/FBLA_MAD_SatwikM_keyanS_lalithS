import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

// Only import expo-speech on native platforms
let Speech: any = null;
if (Platform.OS !== 'web') {
  Speech = require('expo-speech');
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    // No-op on web
    if (Platform.OS === 'web' || !Speech) {
      return;
    }

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [isSpeaking]);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' || !Speech) {
      return;
    }
    
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};