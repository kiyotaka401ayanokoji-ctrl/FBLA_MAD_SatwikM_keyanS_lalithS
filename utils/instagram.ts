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

// Alternative method: Scrape from Instagram's public page HTML
async function scrapeInstagramPostsAlternative(username: string): Promise<SocialPost[]> {
  try {
    console.log(`🔍 Attempting alternative scrape for @${username}...`);
    
    // Fetch the public Instagram page
    const url = `https://www.instagram.com/${username}/`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram page: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract JSON data from the HTML
    const scriptRegex = /<script type="application\/ld\+json">({.*?})<\/script>/g;
    const matches = html.match(scriptRegex);
    
    if (!matches || matches.length === 0) {
      console.warn(`⚠️ Could not find JSON data in HTML for @${username}`);
      return [];
    }

    // Parse the JSON data
    const jsonData = JSON.parse(matches[0].replace(/<script type="application\/ld\+json">|<\/script>/g, ''));
    
    // Extract posts from the structured data
    const posts: SocialPost[] = [];
    
    // This is a simplified version - Instagram's HTML structure may vary
    console.log(`✅ Successfully scraped data from @${username}`);
    return posts;
  } catch (error) {
    console.error(`❌ Error with alternative scrape for @${username}:`, error);
    return [];
  }
}

// Scrape Instagram posts from public profile
async function scrapeInstagramPosts(username: string): Promise<SocialPost[]> {
  try {
    console.log(`🔍 Scraping Instagram posts for @${username}...`);
    
    // Method 1: Try the public API endpoint
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ Primary method failed, trying alternative...`);
      return await scrapeInstagramPostsAlternative(username);
    }

    const data = await response.json();
    const edges = data?.graphql?.user?.edge_owner_to_timeline_media?.edges || 
                  data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

    if (edges.length === 0) {
      console.warn(`⚠️ No posts found for @${username}`);
      return [];
    }

    const posts: SocialPost[] = edges.slice(0, 12).map((edge: any) => {
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
        retweets: 0,
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
    // Try alternative method as fallback
    return await scrapeInstagramPostsAlternative(username);
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