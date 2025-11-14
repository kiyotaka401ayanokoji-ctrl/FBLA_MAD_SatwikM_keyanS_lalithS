import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const structuredClone = require('@ungap/structured-clone');
  const { polyfillGlobal } = require('react-native/Libraries/Utilities/PolyfillFunctions');
  const { TextEncoderStream, TextDecoderStream } = require('@stardazed/streams-text-encoding');

  if (!global.structuredClone) {
    polyfillGlobal('structuredClone', () => structuredClone);
  }

  polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
  polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
}

export {};