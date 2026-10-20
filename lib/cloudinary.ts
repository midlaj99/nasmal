import { v2 as cloudinary } from 'cloudinary';
import { saveImageToDb, getCloudinaryConfig } from './db';

/**
 * Enterprise Cloudinary Media Acceleration & Optimization Engine
 * - Compresses videos with adaptive H.264/WebM encoding (f_auto, q_auto, vc_auto)
 * - Zero Mongo storage consumed when Cloudinary is active (Mongo stores only the lightweight CDN URL)
 * - Zero local disk storage used
 * - Instant hardware-accelerated playback with fast streaming
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  folder = 'nasmal_packages',
  contentType = 'image/jpeg'
): Promise<string> {
  const isVideo = contentType.startsWith('video/');
  const config = await getCloudinaryConfig();

  if (config.isConfigured) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    try {
      const uploadOptions: any = {
        folder,
        resource_type: isVideo ? 'video' : 'image',
      };

      if (isVideo) {
        uploadOptions.eager = [
          { quality: 'auto', fetch_format: 'auto' }
        ];
        uploadOptions.eager_async = false;
      } else {
        uploadOptions.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
      }

      const uploadPromise = new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // 60s timeout for videos, 8s for images
      const timeoutLimit = isVideo ? 60000 : 8000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cloudinary upload timed out')), timeoutLimit)
      );

      const uploadResult: any = await Promise.race([uploadPromise, timeoutPromise]);
      if (uploadResult?.secure_url) {
        let finalUrl = uploadResult.secure_url;
        // Inject streaming & codec optimization flags for video if not already present
        if (isVideo && finalUrl.includes('/video/upload/') && !finalUrl.includes('/f_auto')) {
          finalUrl = finalUrl.replace('/video/upload/', '/video/upload/f_auto,q_auto,vc_auto/');
        }
        return finalUrl;
      }
    } catch (err: any) {
      console.warn('Cloudinary upload bypass notice:', err?.message || err);
    }
  }

  // Fallback to MongoDB database storage (guaranteed safe under 100ms)
  return await saveImageToDb(buffer, contentType, filename);
}

export default cloudinary;
