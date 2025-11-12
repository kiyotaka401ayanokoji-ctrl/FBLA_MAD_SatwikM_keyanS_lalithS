import { SocialPost } from '../types';

// Format timestamp to relative time
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// NOTE: Instagram data loading is now primarily handled by InstagramWebView component
// This utility function provides a fallback for when WebView is not available

// Simplified fallback function for when WebView is not available
// The main Instagram loading is now handled by InstagramWebView component
async function fetchInstagramPosts(username: string): Promise<SocialPost[]> {
  console.log(`🔄 Fallback Instagram fetch for @${username} - WebView should handle real data`);

  const isNational = username === 'fbla_national';
  const displayName = isNational ? 'FBLA National' : 'FBLA NCHS';

  // Return informative posts about using the WebView for real Instagram data
  const infoPosts: SocialPost[] = [
    {
      id: `webview_info_${username}_${Date.now()}`,
      username: displayName,
      handle: `@${username}`,
      content: `📱 Real Instagram posts are loaded through SociableKit WebView widget. Your content from @${username} will appear here once the widget is fully loaded.`,
      timestamp: 'Loading...',
      likes: 0,
      retweets: 0,
      replies: 0,
      isLiked: false,
      isRetweeted: false,
    }
  ];

  return infoPosts;
}

// Format video duration
function formatVideoDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Fetch posts for FBLA National Instagram
export async function fetchNationalPosts(): Promise<SocialPost[]> {
  return fetchInstagramPosts('fbla_national');
}

// Fetch posts for FBLA NCHS Instagram
export async function fetchChapterPosts(): Promise<SocialPost[]> {
  return fetchInstagramPosts('fbla.nchs');
}

// Main export function
export async function fetchInstagramPostsByUsername(username: string): Promise<SocialPost[]> {
  return fetchInstagramPosts(username);
}

// Export utility functions for the WebView component
export { formatVideoDuration };