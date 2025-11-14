const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Correct custom resolver
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Intercept expo-speech on web and return an empty JS module
  if (platform === 'web' && moduleName === 'expo-speech') {
    return {
      type: 'source',
      filePath: moduleName,
      src: 'export default {};'
    };
  }

  // Use default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = wrapWithReanimatedMetroConfig(config);
