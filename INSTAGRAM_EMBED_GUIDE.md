# Instagram Embed Feed - Implementation Guide

## 🎯 Overview
This implementation provides a **platform-safe Instagram embed feed** that works seamlessly across iOS, Android, and Web platforms.

## 📁 File Structure

### Native Implementation (iOS/Android)
**File:** `components/InstagramFeed.native.tsx`
- Uses `react-native-webview` to display Instagram embeds
- Loads official Instagram embed HTML
- Provides smooth scrolling feed experience

### Web Fallback
**File:** `components/InstagramFeed.tsx`
- Web-friendly fallback (no WebView dependency)
- Directs users to Instagram website
- Clean, simple UI with external link

## 🔄 How Platform Selection Works

React Native automatically selects the correct file based on platform:
- **iOS/Android:** Loads `InstagramFeed.native.tsx`
- **Web:** Loads `InstagramFeed.tsx`

This prevents the `react-native-webview` module from being loaded on web, which would cause errors.

## ✏️ How to Update Posts

### Step 1: Get Instagram Post URLs
1. Go to the Instagram post you want to embed
2. Copy the full URL (e.g., `https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/`)

### Step 2: Update the Array
Open `components/InstagramFeed.native.tsx` and find this section at the top:

```typescript
// 🔥 UPDATE THESE POST URLS WHENEVER YOU WANT TO SHOW NEW POSTS!
const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/',
  'https://www.instagram.com/fbla.nchs/p/DP1X0WJkXig/',
  'https://www.instagram.com/fbla.nchs/p/DQiEQvRkvjA/',
];
```

### Step 3: Replace URLs
Simply replace the URLs with your new post URLs:

```typescript
const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/fbla.nchs/p/NEW_POST_1/',
  'https://www.instagram.com/fbla.nchs/p/NEW_POST_2/',
  'https://www.instagram.com/fbla.nchs/p/NEW_POST_3/',
  'https://www.instagram.com/fbla.nchs/p/NEW_POST_4/', // Add as many as you want!
];
```

### Step 4: Save and Reload
Save the file and the app will automatically reload with the new posts!

## 🎨 Features

### Native (Mobile) Features
✅ Real Instagram embeds with full functionality
✅ Smooth scrolling feed
✅ Loading indicators
✅ Error handling
✅ Header with Instagram handle
✅ All Instagram features (likes, comments, captions)

### Web Features
✅ Clean fallback UI
✅ Direct link to Instagram profile
✅ Responsive design
✅ Matches app theme

## 📱 Usage in Screens

### InstagramFeedScreen
Dedicated screen for Instagram feed:
```typescript
import InstagramFeed from '../components/InstagramFeed';

export default function InstagramFeedScreen() {
  return <InstagramFeed />;
}
```

### AnnouncementsScreen
Integrated into announcements with tabs:
```typescript
import InstagramFeed from '../components/InstagramFeed';

// Inside your component
<View style={styles.feedContainer}>
  <InstagramFeed />
</View>
```

## 🔧 Technical Details

### How It Works (Native)
1. Component generates combined HTML with all Instagram embed codes
2. WebView loads the HTML with Instagram's embed script
3. Instagram's script renders the posts with full functionality
4. Posts are scrollable within the WebView

### Why Platform Splitting?
- `react-native-webview` is **not compatible with web**
- Attempting to import it on web causes build errors
- Platform-specific files (`.native.tsx` and `.tsx`) solve this
- React Native automatically picks the right file per platform

## 🎯 Current Posts
The feed currently displays these posts from @fbla.nchs:
1. https://www.instagram.com/fbla.nchs/p/DQ72gKLEl73/
2. https://www.instagram.com/fbla.nchs/p/DP1X0WJkXig/
3. https://www.instagram.com/fbla.nchs/p/DQiEQvRkvjA/

## 🚀 Future Enhancements
- Add pull-to-refresh functionality
- Implement post caching
- Add share functionality
- Support for multiple Instagram accounts (National vs Chapter)

## 📝 Notes
- Posts load directly from Instagram's servers
- No API keys or tokens required
- Works with public Instagram posts only
- Respects Instagram's embed terms of service