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

// Format video duration
export function formatVideoDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// These functions are no longer used - Instagram data is handled by InstagramWebView component
// Keeping exports for backward compatibility but they now throw descriptive errors
export async function fetchNationalPosts(): Promise<SocialPost[]> {
  throw new Error('fetchNationalPosts is deprecated. Instagram data is now handled by InstagramWebView component.');
}

export async function fetchChapterPosts(): Promise<SocialPost[]> {
  throw new Error('fetchChapterPosts is deprecated. Instagram data is now handled by InstagramWebView component.');
}

export async function fetchInstagramPostsByUsername(username: string): Promise<SocialPost[]> {
  throw new Error('fetchInstagramPostsByUsername is deprecated. Instagram data is now handled by InstagramWebView component.');
}