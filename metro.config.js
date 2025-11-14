const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to handle platform-specific modules
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Return empty module for expo-speech on web
    if (platform === 'web' && moduleName === 'expo-speech') {
      return {
        type: 'empty',
      };
    }
    
    // Use default resolver for everything else
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = wrapWithReanimatedMetroConfig(config);