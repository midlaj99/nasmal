/**
 * Video URL helper utilities for YouTube, Vimeo, and direct video links
 */

export function isEmbedVideo(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com');
}

export function getEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(trimmed);
      const v = parsed.searchParams.get('v');
      if (v) {
        return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&mute=1&loop=1&playlist=${v}&playsinline=1&enablejsapi=1`;
      }
    } catch {}
  }

  // YouTube short URL: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const parts = trimmed.split('youtu.be/');
    const id = parts[1]?.split(/[?&#]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const parts = trimmed.split('youtube.com/shorts/');
    const id = parts[1]?.split(/[?&#]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // YouTube already embed URL: https://www.youtube.com/embed/VIDEO_ID
  if (trimmed.includes('youtube.com/embed/')) {
    const parts = trimmed.split('youtube.com/embed/');
    const id = parts[1]?.split(/[?&#]/)[0];
    if (id) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&enablejsapi=1`;
    }
  }

  // Vimeo URL: https://vimeo.com/123456789
  if (trimmed.includes('vimeo.com/')) {
    const match = trimmed.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&autopause=0`;
    }
  }

  return trimmed;
}
