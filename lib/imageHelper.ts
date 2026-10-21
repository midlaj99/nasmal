/**
 * Image Clarity & Ultra-HD Retina Pixel Enhancer
 * Upgrades images to crisp, high-resolution formats (WebP/AVIF, 95% quality, 1200px-2560px)
 * for maximum sharpness on 4K, PC, and Retina screens.
 */

export function getHighResImageUrl(
  url?: string,
  context: 'hero' | 'card' | 'gallery' | 'thumb' = 'card'
): string {
  if (!url) return '/hero-bg.jpg';
  const trimmed = url.trim();
  if (!trimmed) return '/hero-bg.jpg';

  // Local database images or data URIs remain unchanged
  if (trimmed.startsWith('/api/images') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 1. Unsplash Images: Upgrade to crystal-clear high-definition
  if (trimmed.includes('images.unsplash.com')) {
    const targetWidth = context === 'hero' ? 2560 : context === 'gallery' ? 1920 : context === 'thumb' ? 320 : 1200;
    const targetQuality = context === 'hero' ? 95 : 90;

    let clean = trimmed;
    if (clean.includes('w=')) {
      clean = clean.replace(/w=\d+/, `w=${targetWidth}`);
    } else {
      clean += `${clean.includes('?') ? '&' : '?'}w=${targetWidth}`;
    }

    if (clean.includes('q=')) {
      clean = clean.replace(/q=\d+/, `q=${targetQuality}`);
    } else {
      clean += `&q=${targetQuality}`;
    }

    if (!clean.includes('auto=')) {
      clean += '&auto=format';
    }
    if (!clean.includes('fit=')) {
      clean += '&fit=crop';
    }

    return clean;
  }

  // 2. Cloudinary Images: Inject auto-format and high quality transformations
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    const targetWidth = context === 'hero' ? 2560 : context === 'gallery' ? 1920 : context === 'thumb' ? 320 : 1200;
    const transform = `f_auto,q_auto:best,w_${targetWidth},c_limit`;

    if (!trimmed.includes('/f_auto') && !trimmed.includes('/q_auto')) {
      return trimmed.replace('/image/upload/', `/image/upload/${transform}/`);
    }
  }

  return trimmed;
}
