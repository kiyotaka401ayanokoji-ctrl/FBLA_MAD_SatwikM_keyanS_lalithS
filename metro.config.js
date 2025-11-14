const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver configuration for platform-specific modules
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Handle expo-speech on web - use empty module
    if (platform === 'web' && moduleName === 'expo-speech') {
      return {
        type: 'empty',
      };
    }
    
    // Use default resolution
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = wrapWithReanimatedMetroConfig(config);
