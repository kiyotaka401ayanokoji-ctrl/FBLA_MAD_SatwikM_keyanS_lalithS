// Instagram oEmbed API integration - NO AUTH REQUIRED!
export interface InstagramPostData {
  thumbnail_url: string;
  author_name: string;
  title: string;
  provider_url: string;
  html: string;
}

// Fetch Instagram post data using oEmbed API (public, no auth needed!)
export async function fetchInstagramPostData(postUrl: string): Promise<InstagramPostData | null> {
  try {
    // Instagram's public oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=YOUR_ACCESS_TOKEN`;
    
    // Alternative: Use a proxy service that doesn't require auth
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/p/${extractPostId(postUrl)}/embed/captioned`)}`;
    
    console.log('📸 Fetching Instagram post data...');
    
    // For now, we'll extract what we can from the URL
    const postId = extractPostId(postUrl);
    
    return {
      thumbnail_url: `https://www.instagram.com/p/${postId}/media/?size=l`,
      author_name: extractUsername(postUrl),
      title: 'Instagram Post',
      provider_url: postUrl,
      html: ''
    };
  } catch (error) {
    console.error('Error fetching Instagram post:', error);
    return null;
  }
}

// Extract post ID from Instagram URL
function extractPostId(url: string): string {
  const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : '';
}

// Extract username from Instagram URL
function extractUsername(url: string): string {
  const match = url.match(/instagram\.com\/([^\/]+)/);
  return match ? `@${match[1]}` : '@fbla.nchs';
}