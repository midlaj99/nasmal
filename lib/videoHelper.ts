/**
 * Video URL helper utilities for YouTube, Instagram (Reels & Posts), Vimeo, and streaming links
 */

export function isInstagramUrl(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes('instagram.com') || u.includes('instagr.am');
}

export function isYouTubeUrl(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes('youtube.com') || u.includes('youtu.be');
}

export function isEmbedVideo(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return (
    u.includes('youtube.com') ||
    u.includes('youtu.be') ||
    u.includes('instagram.com') ||
    u.includes('instagr.am') ||
    u.includes('vimeo.com')
  );
}

export function getVideoPlatform(url?: string): 'youtube' | 'instagram' | 'vimeo' | 'direct' | null {
  if (!url) return null;
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('instagram.com') || u.includes('instagr.am')) return 'instagram';
  if (u.includes('vimeo.com')) return 'vimeo';
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')) return 'direct';
  return null;
}

export function getEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // 1. YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(trimmed);
      const v = parsed.searchParams.get('v');
      if (v) {
        return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&mute=1&loop=1&playlist=${v}&playsinline=1&enablejsapi=1`;
      }
    } catch {}
  }

  // 2. YouTube short URL: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const parts = trimmed.split('youtu.be/');
    const id = parts[1]?.split(/[?&#/]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // 3. YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const parts = trimmed.split('youtube.com/shorts/');
    const id = parts[1]?.split(/[?&#/]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // 4. YouTube already embed URL: https://www.youtube.com/embed/VIDEO_ID
  if (trimmed.includes('youtube.com/embed/')) {
    const parts = trimmed.split('youtube.com/embed/');
    const id = parts[1]?.split(/[?&#/]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // 5. Instagram Reels / Posts / TV:
  // e.g. https://www.instagram.com/reel/C-xyz/, https://www.instagram.com/p/C-xyz/
  if (trimmed.includes('instagram.com') || trimmed.includes('instagr.am')) {
    const match = trimmed.match(/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (match && match[1]) {
      const type = trimmed.includes('/reel/') ? 'reel' : 'p';
      return `https://www.instagram.com/${type}/${match[1]}/embed/`;
    }
    if (trimmed.includes('/embed')) {
      return trimmed.split('?')[0].replace(/\/+$/, '') + '/embed/';
    }
  }

  // 6. Vimeo URL: https://vimeo.com/123456789
  if (trimmed.includes('vimeo.com/')) {
    const match = trimmed.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&autopause=0`;
    }
  }

  return trimmed;
}

/**
 * Returns thumbnail image URL for YouTube videos
 */
export function getVideoThumbnail(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  if (trimmed.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(trimmed);
      const v = parsed.searchParams.get('v');
      if (v) return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
    } catch {}
  }
  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split(/[?&#/]/)[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  if (trimmed.includes('youtube.com/shorts/')) {
    const id = trimmed.split('youtube.com/shorts/')[1]?.split(/[?&#/]/)[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  if (trimmed.includes('youtube.com/embed/')) {
    const id = trimmed.split('youtube.com/embed/')[1]?.split(/[?&#/]/)[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  return null;
}

/**
 * Returns stream-optimized video URL with adaptive bitrate flags for Cloudinary & CDN videos.
 */
export function getOptimizedVideoUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Cloudinary video transformation injection
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/video/upload/')) {
    if (!trimmed.includes('/f_auto') && !trimmed.includes('/q_auto')) {
      return trimmed.replace('/video/upload/', '/video/upload/f_auto,q_auto,vc_auto/');
    }
  }

  return trimmed;
}
