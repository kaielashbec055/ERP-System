import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg',
  'audio/mp4',
  'audio/webm',
  'audio/ogg',
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(
      AppError.badRequest(
        `Unsupported file type "${file.mimetype}". Allowed: images, PDF, Word docs, audio (voice messages).`,
      ) as unknown as Error,
    );
  }
  cb(null, true);
}

// Files are buffered in memory then streamed straight to Cloudinary —
// nothing sensitive ever touches disk on the API server itself.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});
