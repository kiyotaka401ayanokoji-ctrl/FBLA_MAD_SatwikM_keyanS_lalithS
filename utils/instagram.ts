import { SocialPost } from '../types';

// Helper function to parse Instagram's timestamp
function parseInstagramTimestamp(timestamp: string): string {
  const now = Date.now();
  const postTime = new Date(timestamp).getTime();
  const diffMs = now - postTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Scrape Instagram posts from public profile
async function scrapeInstagramPosts(username: string): Promise<SocialPost[]> {
  try {
    console.log(`🔍 Scraping Instagram posts for @${username}...`);
    
    // Use Instagram's public API endpoint (no auth required for public profiles)
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram data: ${response.status}`);
    }

    const data = await response.json();
    const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

    if (edges.length === 0) {
      console.warn(`⚠️ No posts found for @${username}`);
      return [];
    }

    const posts: SocialPost[] = edges.slice(0, 12).map((edge: any, index: number) => {
      const node = edge.node;
      const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
      const likes = node.edge_liked_by?.count || 0;
      const comments = node.edge_media_to_comment?.count || 0;
      const timestamp = parseInstagramTimestamp(new Date(node.taken_at_timestamp * 1000).toISOString());
      const videoUrl = node.is_video ? node.video_url : null;
      const thumbnailUrl = node.thumbnail_src || node.display_url;

      return {
        id: node.id,
        username: username === 'fbla_pbl' ? 'FBLA National' : 'FBLA NCHS',
        handle: `@${username}`,
        content: caption,
        timestamp,
        likes,
        retweets: 0, // Instagram doesn't have retweets
        replies: comments,
        isLiked: false,
        isRetweeted: false,
        videoUrl: videoUrl,
        videoThumbnail: node.is_video ? thumbnailUrl : undefined,
      };
    });

    console.log(`✅ Successfully scraped ${posts.length} posts from @${username}`);
    return posts;
  } catch (error) {
    console.error(`❌ Error scraping Instagram for @${username}:`, error);
    return [];
  }
}

// Fetch posts for FBLA National Instagram
export async function fetchNationalPosts(): Promise<SocialPost[]> {
  console.log('📱 Loading FBLA National posts...');
  const posts = await scrapeInstagramPosts('fbla_pbl');
  return posts;
}

// Fetch posts for FBLA NCHS Instagram
export async function fetchChapterPosts(): Promise<SocialPost[]> {
  console.log('🏫 Loading FBLA NCHS posts...');
  const posts = await scrapeInstagramPosts('fbla.nchs');
  return posts;
}

// Main export function
export async function fetchInstagramPostsByUsername(username: string): Promise<SocialPost[]> {
  console.log(`📱 Loading posts for @${username}...`);
  const posts = await scrapeInstagramPosts(username);
  return posts;
}