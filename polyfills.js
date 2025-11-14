// Polyfills for AI SDK on React Native
// This file must be imported early in index.ts

import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    try {
      const structuredClone = require('@ungap/structured-clone');
      const { polyfillGlobal } = require('react-native/Libraries/Utilities/PolyfillFunctions');
      const { TextEncoderStream, TextDecoderStream } = require('@stardazed/streams-text-encoding');

      if (!global.structuredClone) {
        polyfillGlobal('structuredClone', () => structuredClone);
      }

      polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
      polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
    } catch (error) {
      console.warn('Polyfill setup failed:', error);
    }
  };

  setupPolyfills();
}

export {};
