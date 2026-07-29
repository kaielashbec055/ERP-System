import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { logger } from './logger';

if (env.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
} else {
  logger.warn(
    '[cloudinary] Credentials not set — file uploads will be stored locally under /uploads instead. ' +
      'Set CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET to enable cloud storage.',
  );
}

export type UploadFolder =
  | 'avatars'
  | 'homework'
  | 'assignments'
  | 'announcements'
  | 'certificates'
  | 'documents'
  | 'chat-attachments';

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: UploadFolder,
  publicIdHint?: string,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `edupulse/${folder}`,
        public_id: publicIdHint,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export { cloudinary };
