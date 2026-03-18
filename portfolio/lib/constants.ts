/**
 * Application-wide constants to avoid magic numbers and repeated strings
 */

// Authentication & Security
export const BCRYPT_SALT_ROUNDS = 10;
export const JWT_EXPIRY_TIME = '24h';
export const JWT_EXPIRY_SECONDS = 24 * 60 * 60; // 86400

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
export const IMAGE_BUCKET_NAMES = {
  portfolio: 'portfolio-images',
  projects: 'project-images',
} as const;

// API Response
export const NO_AUTH_ERROR = {
  error: 'Authentication required',
  status: 401,
} as const;

export const SERVER_ERROR = {
  error: 'Internal server error',
  status: 500,
} as const;

// Form Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_TITLE_LENGTH = 3;
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 5000;

// UI Messages
export const SESSION_EXPIRED_MESSAGE = 'Session expired. Please login again.';
export const FAILED_TO_UPLOAD_MESSAGE = 'Failed to upload file';
export const UPLOAD_SUCCESS_MESSAGE = 'Uploaded successfully!';
export const FILE_TOO_LARGE_MESSAGE = 'File too large. Max 5MB allowed.';
export const INVALID_FILE_TYPE_MESSAGE =
  'Invalid file type. Only images allowed.';
